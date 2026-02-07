import React from 'react';

export interface Field {
  id: string;
  label: string;
  type: 'input' | 'textarea' | 'list';
  placeholder: string;
}

export interface Blueprint {
  title: string;
  fields: Field[];
  inspirePrompt: string;
  forgePrompt: string;
  initialPromptHeaders: Record<string, string>;
  refinementOptions?: { id: string; label: string; prompt: string; }[];
  inspireExample?: FormData;
}

export type BlueprintCollection = Record<string, Blueprint>;

export type FormData = Record<string, string | string[]>;

export interface HistoryEntry {
  timestamp: string;
  promptOutput: string;
  refineInput: string;
}

export interface Project {
  id:string;
  name: string;
  page: 'forge' | 'worldbuilder' | 'gamedev' | 'projects';
  mode: string;
  formData: FormData;
  promptOutput: string;
  lastSaved: string;
  outputMode?: 'text' | 'json' | 'markdown' | 'xml';
  history?: HistoryEntry[];
}

export interface LoadingState {
  inspire: boolean;
  refine: boolean;
  assemble: boolean;
  analyze: boolean;
}

export interface PromptAnalysisResult {
    qualityScore: number;
    overallFeedback: string;
    suggestions: string[];
}

export interface RefinementSettings {
    creativity: number;
    formality: number;
    verbosity: number;
    constraintAdherence: number;
}

// Props for new panel components
export interface RawMaterialsPanelProps {
    blueprints: BlueprintCollection;
    mode: string;
    onModeChange: (newMode: string) => void;
    children: React.ReactNode;
    formData: FormData;
    handleFieldChange: (fieldId: string, value: string | string[]) => void;
    handleInspireMe: () => void;
    handleStartOver: () => void;
    isInspiring: boolean;
    outputMode: 'text' | 'json' | 'markdown' | 'xml';
    onOutputModeChange: (mode: 'text' | 'json' | 'markdown' | 'xml') => void;
    onAssemble: () => void;
    isAssembling: boolean;
    hasContent: boolean;
}

export interface ForgePanelProps {
    promptOutput: string;
    tokenCount: number;
    outputMode: 'text' | 'json' | 'markdown' | 'xml';
    isDownloaded: boolean;
    handlePromptOutputChange: (value: string) => void;
    copyToClipboard: () => void;
    downloadOutput: () => void;
    handleExportClick: () => void;
}

export interface TemperAndRefinePanelProps {
    activeBlueprint: Blueprint;
    isLoading: boolean;
    handleRefine: (refineInput: string, settings: RefinementSettings | null) => void;
    promptOutput: string;
    handleAnalyzePrompt: () => void;
    isAnalyzing: boolean;
    analysisResult: PromptAnalysisResult | null;
    clearAnalysis: () => void;
    useAnalysisGuide: boolean;
    onUseAnalysisGuideChange: (checked: boolean) => void;
}

export interface HistoryManagerProps {
    history: HistoryEntry[];
    onRestore: (entry: HistoryEntry) => void;
    onDelete: (timestamp: string) => void;
}