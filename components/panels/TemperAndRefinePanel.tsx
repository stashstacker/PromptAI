import React, { useState } from 'react';
import { TemperAndRefinePanelProps, RefinementSettings } from '../../types';
import Tooltip from '../Tooltip';
import { AnalyzeIcon, ForgeIcon, SpinnerIcon } from '../icons';

const QualityScore: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 20; // 2 * pi * radius
    const offset = circumference - (score / 100) * circumference;

    const getColor = (s: number) => {
        if (s < 50) return 'text-red-500';
        if (s < 80) return 'text-yellow-500';
        return 'text-green-500';
    };
    
    const getTrackColor = (s: number) => {
        if (s < 50) return 'stroke-red-500';
        if (s < 80) return 'stroke-yellow-500';
        return 'stroke-green-500';
    };

    return (
        <div className="relative flex items-center justify-center h-16 w-16">
            <svg className="absolute" width="64" height="64" viewBox="0 0 44 44">
                <circle className="stroke-gray-600" strokeWidth="4" fill="transparent" r="20" cx="22" cy="22" />
                <circle
                    className={`transform -rotate-90 origin-center transition-all duration-500 ease-out ${getTrackColor(score)}`}
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r="20"
                    cx="22"
                    cy="22"
                />
            </svg>
            <span className={`text-xl font-bold ${getColor(score)}`}>{score}</span>
        </div>
    );
};

const sliderDescriptions = {
    creativity: { 1: 'Strict', 2: 'Subtle', 3: 'Balanced', 4: 'Inventive', 5: 'Visionary' },
    formality: { 1: 'Casual', 2: 'Friendly', 3: 'Neutral', 4: 'Formal', 5: 'Academic' },
    verbosity: { 1: 'Concise', 2: 'Brief', 3: 'Balanced', 4: 'Detailed', 5: 'Exhaustive' },
    constraintAdherence: { 1: 'Suggestion', 2: 'Guideline', 3: 'Balanced', 4: 'Strict Rule', 5: 'Absolute Law' },
};

const RefinementSlider: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    descriptions: Record<number, string>;
    tooltipText: string;
    minLabel?: string;
    maxLabel?: string;
    disabled?: boolean;
}> = ({ label, value, onChange, descriptions, tooltipText, minLabel = 'Less', maxLabel = 'More', disabled=false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
            <Tooltip text={tooltipText}>
                <span className="cursor-help border-b border-dashed border-gray-500">{label}</span>
            </Tooltip>
            : <span className="font-bold text-orange-400">{descriptions[value]}</span>
        </label>
        <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`${label} intensity`}
            disabled={disabled}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
            <span>{minLabel}</span>
            <span>{maxLabel}</span>
        </div>
    </div>
);


const TemperAndRefinePanel: React.FC<TemperAndRefinePanelProps> = ({
    activeBlueprint,
    isLoading,
    handleRefine,
    promptOutput,
    handleAnalyzePrompt,
    isAnalyzing,
    analysisResult,
    clearAnalysis,
    useAnalysisGuide,
    onUseAnalysisGuideChange,
}) => {
    const [refineInput, setRefineInput] = useState('');
    const [isParametersEnabled, setIsParametersEnabled] = useState(false);
    const [creativity, setCreativity] = useState(3);
    const [formality, setFormality] = useState(3);
    const [verbosity, setVerbosity] = useState(3);
    const [constraintAdherence, setConstraintAdherence] = useState(4);

    const onRefineClick = () => {
        const settings: RefinementSettings | null = isParametersEnabled 
            ? { creativity, formality, verbosity, constraintAdherence }
            : null;
        handleRefine(refineInput, settings);
        setRefineInput('');
    };
    
    const handleSuggestionClick = (prompt: string) => {
        setRefineInput(prev => prev ? `${prev.trim()} ${prompt}` : prompt);
    };
    
    return (
        <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">3. Temper & Refine</h3>
            
            {analysisResult && (
                <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-600 fade-in">
                    <div className="flex justify-between items-start">
                        <h4 className="text-lg font-semibold text-orange-400 mb-3">Prompt Analysis</h4>
                        <button onClick={clearAnalysis} className="text-gray-500 hover:text-white text-2xl leading-none">&times;</button>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <QualityScore score={analysisResult.qualityScore} />
                            <p className="text-xs text-center text-gray-400 mt-1">Quality</p>
                        </div>
                        <div className="flex-grow">
                             <p className="text-sm text-gray-300 mb-3">{analysisResult.overallFeedback}</p>
                             <h5 className="text-sm font-semibold text-gray-200 mb-2">Suggestions:</h5>
                             <ul className="space-y-2 text-sm text-gray-400 list-disc list-inside">
                                 {analysisResult.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                             </ul>
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-700/50">
                        <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-300 hover:text-white transition-colors">
                            <input
                                type="checkbox"
                                checked={useAnalysisGuide}
                                onChange={(e) => onUseAnalysisGuideChange(e.target.checked)}
                                className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-orange-500 focus:ring-orange-500"
                            />
                            <span>Use Analysis as a Guide in the next Refinement</span>
                        </label>
                    </div>
                </div>
            )}

            <p className="text-sm text-gray-400 mb-4">Set your parameters, provide a focus, and then Refine. Or, analyze the prompt for feedback.</p>

            <div className="flex justify-end mb-4">
                <label className="flex items-center cursor-pointer">
                    <span className="mr-3 text-sm font-medium text-gray-300">Use Refinement Parameters</span>
                    <div className="relative">
                        <input type="checkbox" checked={isParametersEnabled} onChange={() => setIsParametersEnabled(!isParametersEnabled)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-orange-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </div>
                </label>
            </div>

            <div className={`mb-4 bg-gray-900/50 p-4 rounded-lg space-y-4 transition-opacity ${!isParametersEnabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <RefinementSlider 
                    label="Creativity"
                    value={creativity}
                    onChange={setCreativity}
                    descriptions={sliderDescriptions.creativity}
                    tooltipText="Controls the level of imaginative and novel ideas in the rewrite."
                    disabled={!isParametersEnabled}
                />
                 <RefinementSlider 
                    label="Formality"
                    value={formality}
                    onChange={setFormality}
                    descriptions={sliderDescriptions.formality}
                    tooltipText="Adjusts the tone of the language from casual to academic."
                    disabled={!isParametersEnabled}
                />
                <RefinementSlider 
                    label="Verbosity"
                    value={verbosity}
                    onChange={setVerbosity}
                    descriptions={sliderDescriptions.verbosity}
                    tooltipText="Controls the amount of detail and length of the response."
                    disabled={!isParametersEnabled}
                />
                 <RefinementSlider 
                    label="Rule Strictness"
                    value={constraintAdherence}
                    onChange={setConstraintAdherence}
                    descriptions={sliderDescriptions.constraintAdherence}
                    tooltipText="Controls how strictly the AI follows rules. Lower values give more creative freedom but may deviate from format. Higher values are more precise but can fail if instructions are too rigid."
                    minLabel="Flexible"
                    maxLabel="Strict"
                    disabled={!isParametersEnabled}
                />
            </div>

            <div className="space-y-4">
                <input
                    type="text"
                    value={refineInput}
                    onChange={(e) => setRefineInput(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 'Focus on the user stories' or 'Make the tone more playful'"
                />
                <div className="flex flex-col sm:flex-row gap-4">
                     <button 
                        onClick={handleAnalyzePrompt} 
                        disabled={isAnalyzing || isLoading || !promptOutput} 
                        className="w-full sm:w-1/3 bg-gray-700 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                         {isAnalyzing ? <SpinnerIcon /> : <AnalyzeIcon />}
                        <span>{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
                    </button>
                    <button 
                        onClick={onRefineClick} 
                        disabled={isLoading || isAnalyzing || !promptOutput} 
                        className="w-full sm:w-2/3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-2 px-6 rounded-lg transition-transform duration-200 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? <SpinnerIcon /> : <ForgeIcon />}
                        <span>{isLoading ? 'Refining...' : 'Refine'}</span>
                    </button>
                </div>
            </div>
            {activeBlueprint.refinementOptions && activeBlueprint.refinementOptions.length > 0 && (
                <div className="mt-4">
                    <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Suggested Refinements</h5>
                    <div className="flex gap-2 flex-wrap">
                        {activeBlueprint.refinementOptions.map(option => (
                            <button
                                key={option.id}
                                onClick={() => handleSuggestionClick(option.prompt)}
                                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-3 py-1 rounded-full transition-colors"
                                title={option.prompt}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemperAndRefinePanel;