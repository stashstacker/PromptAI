import React, { useState, useEffect, useMemo } from 'react';
import { BlueprintCollection, FormData, LoadingState, Project, HistoryEntry, PromptAnalysisResult, RefinementSettings } from '../types';
import SaveModal from './SaveModal';
import Toast from './Toast';
import { inspireWithAI, generateContent, analyzePromptQuality } from '../services/geminiService';
import { exportProject } from '../services/projectService';
import { useProject } from '../contexts/ProjectContext';
import { useToast } from '../hooks/useToast';
import { useProjectHistory } from '../hooks/useProjectHistory';
import { buildInitialPrompt, buildRefinementPrompt, getFinalDeliverableInstruction, stripFinalDeliverable } from '../services/promptBuilder';
import RawMaterialsPanel from './panels/RawMaterialsPanel';
import ForgePanel from './panels/ForgePanel';
import TemperAndRefinePanel from './panels/TemperAndRefinePanel';
import HistoryManager from './panels/HistoryManager';

interface ForgeUIProps {
    blueprints: BlueprintCollection;
    mode: string;
    onModeChange: (newMode: string) => void;
    children: React.ReactNode;
    mainPage: 'forge' | 'worldbuilder' | 'gamedev';
    category: 'project' | 'creative' | 'worldbuilder' | 'gamedev';
}

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
        <span>{message}</span>
    </div>
);

const ForgeUI: React.FC<ForgeUIProps> = ({ blueprints, mode, onModeChange, children, mainPage, category }) => {
    const { loadedProject, setLoadProject } = useProject();
    const { toastMessage, showToast, displayToast } = useToast();
    const { history, setHistory, addHistoryEntry, deleteHistoryEntry, clearHistory, resetHistoryWithEntry } = useProjectHistory();
    
    const [formData, setFormData] = useState<FormData>({});
    const [promptOutput, setPromptOutput] = useState('');
    const [outputMode, setOutputMode] = useState<'text' | 'json' | 'markdown' | 'xml'>('text');
    const [isLoading, setIsLoading] = useState<LoadingState>({ inspire: false, refine: false, assemble: false, analyze: false });
    const [error, setError] = useState('');
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [tokenCount, setTokenCount] = useState(0);
    const [analysisResult, setAnalysisResult] = useState<PromptAnalysisResult | null>(null);
    const [useAnalysisGuide, setUseAnalysisGuide] = useState(false);


    const activeBlueprint = useMemo(() => blueprints[mode], [blueprints, mode]);

    const getInitialData = (currentMode: string): FormData => {
        const blueprint = blueprints[currentMode];
        if (!blueprint) return {};
        const initialData: FormData = {};
        blueprint.fields.forEach(field => {
            initialData[field.id] = field.type === 'list' ? [''] : '';
        });
        return initialData;
    };
    
    useEffect(() => {
        if (loadedProject) {
            onModeChange(loadedProject.mode);
            setFormData(loadedProject.formData);
            setPromptOutput(loadedProject.promptOutput);
            setOutputMode(loadedProject.outputMode || 'text');
            
            const initialHistory = loadedProject.history && loadedProject.history.length > 0
                ? loadedProject.history
                : [{
                    timestamp: loadedProject.lastSaved,
                    promptOutput: loadedProject.promptOutput,
                    refineInput: 'Project Loaded'
                  }];
            setHistory(initialHistory);

            setLoadProject(null);
        } else {
             setFormData(getInitialData(mode));
             setPromptOutput('');
             setOutputMode('text');
             clearHistory();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, blueprints, loadedProject]);

    useEffect(() => {
        if (promptOutput) {
            const count = Math.ceil(promptOutput.length / 4);
            setTokenCount(count);
            setIsDownloaded(false);
            setAnalysisResult(null); // Clear analysis when prompt changes
            setUseAnalysisGuide(false); // Also clear the guide setting
        } else {
            setTokenCount(0);
        }
    }, [promptOutput]);

    const hasContent = useMemo(() => {
        if (!activeBlueprint) return false;
        for (const field of activeBlueprint.fields) {
            const value = formData[field.id];
            if (Array.isArray(value) ? value.filter(Boolean).length > 0 : !!value) {
                return true;
            }
        }
        return false;
    }, [formData, activeBlueprint]);

    const handleFieldChange = (fieldId: string, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
    };
    
    const handleStartOver = () => {
        setFormData(getInitialData(mode));
        setPromptOutput('');
        clearHistory();
    };

    const handleAssemble = async () => {
        if (!hasContent) {
            setError("Add some raw materials before assembling.");
            return;
        }
        setIsLoading(prev => ({ ...prev, assemble: true }));
        setError('');
        try {
            const prompt = buildInitialPrompt(activeBlueprint, formData, outputMode);
            const result = await generateContent(prompt, outputMode);
            
            const instruction = getFinalDeliverableInstruction(category);
            let finalOutput = result;
            const header = "## FINAL DELIVERABLE ##";
            
            switch(outputMode) {
                case 'json':
                    finalOutput += `\n\n/*\n${header}\n${instruction}\n*/`;
                    break;
                case 'xml':
                    finalOutput += `\n\n<!--\n${header}\n${instruction}\n-->`;
                    break;
                case 'markdown':
                case 'text':
                default:
                    finalOutput += `\n\n${header}\n${instruction}`;
                    break;
            }

            setPromptOutput(finalOutput);
            
            resetHistoryWithEntry({
                timestamp: new Date().toISOString(),
                promptOutput: finalOutput,
                refineInput: 'Initial Assembly from Raw Materials',
            });

        } catch (err) {
            console.error("Error during AI assembly:", err);
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(`Assembly failed: ${errorMessage}`);
        } finally {
            setIsLoading(prev => ({ ...prev, assemble: false }));
        }
    };

    const handleInspireMe = async () => {
        setIsLoading(prev => ({ ...prev, inspire: true }));
        setError('');
        try {
            const result = await inspireWithAI(activeBlueprint, formData);
            if (typeof result === 'string') {
                // This is the fallback case for failed JSON parsing
                setPromptOutput(result);
                displayToast("AI response couldn't be parsed. Raw output sent to The Forge.");
                resetHistoryWithEntry({
                    timestamp: new Date().toISOString(),
                    promptOutput: result,
                    refineInput: 'Inspire Me (Parsing Failed - Raw Output)',
                });
            } else {
                // This is the success case
                setFormData(result);
            }
        } catch (err) {
            console.error("Error during AI inspiration:", err);
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(`Inspiration failed: ${errorMessage}`);
        } finally {
            setIsLoading(prev => ({ ...prev, inspire: false }));
        }
    };

    const handleRefine = async (refineInput: string, settings: RefinementSettings | null) => {
        if (!promptOutput) {
            setError("The forge is empty. Please assemble a prompt from your raw materials first.");
            return;
        }
        setIsLoading(prev => ({ ...prev, refine: true }));
        setError('');

        try {
            const currentPrompt = stripFinalDeliverable(promptOutput);
            const prompt = buildRefinementPrompt(
                currentPrompt, 
                refineInput, 
                outputMode, 
                settings,
                useAnalysisGuide ? analysisResult : null
            );
            const result = await generateContent(prompt, outputMode);
            
            const instruction = getFinalDeliverableInstruction(category);
            let finalOutput = result;
            const header = "## FINAL DELIVERABLE ##";

            switch(outputMode) {
                case 'json':
                    finalOutput += `\n\n/*\n${header}\n${instruction}\n*/`;
                    break;
                case 'xml':
                    finalOutput += `\n\n<!--\n${header}\n${instruction}\n-->`;
                    break;
                case 'markdown':
                case 'text':
                default:
                    finalOutput += `\n\n${header}\n${instruction}`;
                    break;
            }

            setPromptOutput(finalOutput);

            const historyRefinementDesc = settings 
                ? `C:${settings.creativity}, F:${settings.formality}, V:${settings.verbosity}, A:${settings.constraintAdherence}`
                : 'Direct';

            addHistoryEntry({
              timestamp: new Date().toISOString(),
              promptOutput: finalOutput,
              refineInput: `Refined (${historyRefinementDesc}): ${refineInput || 'General Refinement'}`,
            });
        } catch (err) {
            console.error("Error during AI refinement:", err);
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(`Refinement failed: ${errorMessage}`);
        } finally {
            setIsLoading(prev => ({ ...prev, refine: false }));
        }
    };

    const handleAnalyzePrompt = async () => {
        if (!promptOutput) {
            setError("The forge is empty. Nothing to analyze.");
            return;
        }
        setIsLoading(prev => ({ ...prev, analyze: true }));
        setError('');
        setAnalysisResult(null);
        setUseAnalysisGuide(false);
        try {
            const currentPrompt = stripFinalDeliverable(promptOutput);
            const result = await analyzePromptQuality(currentPrompt);
            setAnalysisResult(result);
        } catch (err)
 {
            console.error("Error during prompt analysis:", err);
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(`Analysis failed: ${errorMessage}`);
        } finally {
            setIsLoading(prev => ({ ...prev, analyze: false }));
        }
    };

    const copyToClipboard = () => {
        if (!promptOutput) return;
        navigator.clipboard.writeText(promptOutput).then(() => {
            displayToast("Copied to clipboard!");
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    const downloadOutput = () => {
        const fileExtensions = { text: 'txt', json: 'json', markdown: 'md', xml: 'xml' };
        const mimeTypes = { text: 'text/plain', json: 'application/json', markdown: 'text/markdown', xml: 'application/xml' };
        
        const extension = fileExtensions[outputMode];
        const mimeType = mimeTypes[outputMode];

        const titleField = activeBlueprint.fields.find(f => f.id.includes('title') || f.id.includes('name'));
        const filenameBase = (titleField && formData[titleField.id]) ? String(formData[titleField.id]) : 'instruction_set';
        const filename = filenameBase.trim().toLowerCase().replace(/\s+/g, '_') || 'instruction_set';
        
        const blob = new Blob([promptOutput], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsDownloaded(true);
    };
    
    const getCurrentProjectData = (name: string): Project => {
        return {
            id: Date.now().toString(),
            name: name,
            page: mainPage,
            mode: mode,
            formData: formData,
            promptOutput: promptOutput,
            lastSaved: new Date().toISOString(),
            outputMode: outputMode,
            history: history,
        };
    };

    const handleExport = async (projectName: string) => {
        const projectData = getCurrentProjectData(projectName);
        await exportProject(projectData); 
        displayToast("Project saved to local library!");
        setIsSaveModalOpen(false);
    };

    const handleRestoreHistory = (entry: HistoryEntry) => {
        setPromptOutput(entry.promptOutput);
        displayToast(`Restored version from ${new Date(entry.timestamp).toLocaleDateString()}`);
    };

    const handleDeleteHistory = (timestamp: string) => {
        deleteHistoryEntry(timestamp);
        displayToast('History entry deleted.');
    };

    const clearAnalysis = () => {
        setAnalysisResult(null);
        setUseAnalysisGuide(false);
    }

    return (
        <>
            <SaveModal show={isSaveModalOpen} onSave={handleExport} onCancel={() => setIsSaveModalOpen(false)} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <RawMaterialsPanel
                    blueprints={blueprints}
                    mode={mode}
                    onModeChange={onModeChange}
                    formData={formData}
                    handleFieldChange={handleFieldChange}
                    handleInspireMe={handleInspireMe}
                    handleStartOver={handleStartOver}
                    isInspiring={isLoading.inspire}
                    outputMode={outputMode}
                    onOutputModeChange={setOutputMode}
                    onAssemble={handleAssemble}
                    isAssembling={isLoading.assemble}
                    hasContent={hasContent}
                >
                    {children}
                </RawMaterialsPanel>

                <div className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700 flex flex-col">
                    <ForgePanel 
                        promptOutput={promptOutput}
                        tokenCount={tokenCount}
                        outputMode={outputMode}
                        isDownloaded={isDownloaded}
                        handlePromptOutputChange={setPromptOutput}
                        copyToClipboard={copyToClipboard}
                        downloadOutput={downloadOutput}
                        handleExportClick={() => setIsSaveModalOpen(true)}
                    />
                    
                    <TemperAndRefinePanel
                        activeBlueprint={activeBlueprint}
                        isLoading={isLoading.refine}
                        handleRefine={handleRefine}
                        promptOutput={promptOutput}
                        handleAnalyzePrompt={handleAnalyzePrompt}
                        isAnalyzing={isLoading.analyze}
                        analysisResult={analysisResult}
                        clearAnalysis={clearAnalysis}
                        useAnalysisGuide={useAnalysisGuide}
                        onUseAnalysisGuideChange={setUseAnalysisGuide}
                    />
                    {error && <ErrorDisplay message={error} />}
                    
                    <HistoryManager 
                        history={history}
                        onRestore={handleRestoreHistory}
                        onDelete={handleDeleteHistory}
                    />
                </div>
            </div>
            <Toast message={toastMessage} show={showToast} />
        </>
    );
};

export default ForgeUI;