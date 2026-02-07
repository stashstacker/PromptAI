import React from 'react';
import { RawMaterialsPanelProps } from '../../types';
import DynamicField from '../DynamicField';
import { AssembleIcon, LightningIcon, ResetIcon, SpinnerIcon } from '../icons';

const RawMaterialsPanel: React.FC<RawMaterialsPanelProps> = ({
    blueprints,
    mode,
    onModeChange,
    children,
    formData,
    handleFieldChange,
    handleInspireMe,
    handleStartOver,
    isInspiring,
    outputMode,
    onOutputModeChange,
    onAssemble,
    isAssembling,
    hasContent,
}) => {
    const activeBlueprint = blueprints[mode];
    
    return (
        <div className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-semibold text-gray-100">1. Add Raw Materials</h2>
            </div>
            
            {/* Page-specific selectors (like forge type) are passed as children */}
            {children}

            {activeBlueprint && activeBlueprint.fields.map(field => (
                <DynamicField
                    key={field.id}
                    field={field}
                    value={formData[field.id] || (field.type === 'list' ? [] : '')}
                    onChange={(value) => handleFieldChange(field.id, value)}
                />
            ))}
            <div className="mt-8 pt-6 border-t border-gray-700 space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={handleInspireMe} disabled={isInspiring} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isInspiring ? <SpinnerIcon /> : <LightningIcon />}
                        <span>{isInspiring ? 'Inspiring...' : 'Inspire Me'}</span>
                    </button>
                    
                    <button onClick={handleStartOver} className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                         <ResetIcon />
                        <span>Start Over</span>
                    </button>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Output Format</label>
                    <div className="grid grid-cols-4 gap-2 bg-gray-900/50 p-1 rounded-lg">
                        {(['text', 'json', 'markdown', 'xml'] as const).map(format => (
                            <button
                                key={format}
                                onClick={() => onOutputModeChange(format)}
                                className={`w-full px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                                    outputMode === format
                                        ? 'bg-orange-600 text-white'
                                        : 'text-gray-400 bg-gray-700 hover:bg-gray-600 hover:text-white'
                                }`}
                            >
                                {format.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={onAssemble}
                    disabled={isAssembling || !hasContent}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isAssembling ? <SpinnerIcon /> : <AssembleIcon />}
                    <span>{isAssembling ? 'Assembling...' : 'Assemble in Forge'}</span>
                </button>
            </div>
        </div>
    );
};

export default RawMaterialsPanel;