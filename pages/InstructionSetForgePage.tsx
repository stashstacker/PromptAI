
import React, { useState, useEffect, useMemo } from 'react';
import { projectForgeBlueprints, creativeForgeBlueprints } from '../constants';
import ForgeUI from '../components/ForgeUI';
import { useProject } from '../contexts/ProjectContext';

type ForgeType = 'project' | 'creative';

const InstructionSetForgePage: React.FC = () => {
    const { loadedProject, setLoadProject } = useProject();

    const getInitialForgeType = (project: typeof loadedProject): ForgeType => {
        if (project) {
            if (projectForgeBlueprints[project.mode]) return 'project';
            if (creativeForgeBlueprints[project.mode]) return 'creative';
        }
        return 'project';
    };

    const [forgeType, setForgeType] = useState<ForgeType>(getInitialForgeType(loadedProject));

    const blueprints = useMemo(() => {
        return forgeType === 'project' ? projectForgeBlueprints : creativeForgeBlueprints;
    }, [forgeType]);

    const getInitialMode = (project: typeof loadedProject, currentForgeType: ForgeType) => {
        const currentBlueprints = currentForgeType === 'project' ? projectForgeBlueprints : creativeForgeBlueprints;
        if (project?.mode && currentBlueprints[project.mode]) {
            return project.mode;
        }
        return Object.keys(currentBlueprints)[0];
    };

    const [activeMode, setActiveMode] = useState(getInitialMode(loadedProject, forgeType));

    useEffect(() => {
        if (loadedProject) {
            const initialForgeType = getInitialForgeType(loadedProject);
            setForgeType(initialForgeType);
            setActiveMode(getInitialMode(loadedProject, initialForgeType));
        }
    }, [loadedProject]);
    
    const handleForgeTypeChange = (type: ForgeType) => {
        if (type !== forgeType) {
            setLoadProject(null);
            setForgeType(type);
            const newBlueprints = type === 'project' ? projectForgeBlueprints : creativeForgeBlueprints;
            setActiveMode(Object.keys(newBlueprints)[0]);
        }
    }
    
    return (
        <ForgeUI 
            blueprints={blueprints} 
            mode={activeMode} 
            onModeChange={setActiveMode} 
            mainPage="forge"
            category={forgeType}
        >
            <div className="mb-6 flex border-b border-gray-700">
                <button onClick={() => handleForgeTypeChange('project')} className={`px-4 py-2 text-sm font-medium transition-colors ${forgeType === 'project' ? 'border-b-2 border-orange-500 text-white' : 'text-gray-400 hover:text-white hover:border-b-2 hover:border-gray-500'}`}>
                    Project & Technical
                </button>
                <button onClick={() => handleForgeTypeChange('creative')} className={`px-4 py-2 text-sm font-medium transition-colors ${forgeType === 'creative' ? 'border-b-2 border-orange-500 text-white' : 'text-gray-400 hover:text-white hover:border-b-2 hover:border-gray-500'}`}>
                    Creative & Writing
                </button>
            </div>
            <div className="mb-6">
                <label htmlFor="mode-selector" className="block text-sm font-medium text-gray-300 mb-2">Forge Mode</label>
                <select 
                    id="mode-selector" 
                    value={activeMode} 
                    onChange={(e) => { 
                        setLoadProject(null); 
                        setActiveMode(e.target.value); 
                    }} 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    {Object.keys(blueprints).map(key => (
                        <option key={key} value={key}>{blueprints[key].title}</option>
                    ))}
                </select>
            </div>
        </ForgeUI>
    );
};

export default InstructionSetForgePage;
