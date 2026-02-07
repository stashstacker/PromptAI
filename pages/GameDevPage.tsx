
import React, { useState, useEffect } from 'react';
import { gameDevBlueprints } from '../constants';
import ForgeUI from '../components/ForgeUI';
import { useProject } from '../contexts/ProjectContext';

const GameDevPage: React.FC = () => {
    const { loadedProject, setLoadProject } = useProject();
    const [activeMode, setActiveMode] = useState(loadedProject ? loadedProject.mode : 'gameConcept');
    
    useEffect(() => {
        if (loadedProject) {
            setActiveMode(loadedProject.mode);
        }
    }, [loadedProject]);
    
    return (
        <ForgeUI 
            blueprints={gameDevBlueprints} 
            mode={activeMode} 
            onModeChange={setActiveMode} 
            mainPage="gamedev"
            category="gamedev"
        >
            <div className="mb-6">
                <label htmlFor="element-selector" className="block text-sm font-medium text-gray-300 mb-2">Element Type</label>
                <select 
                    id="element-selector" 
                    value={activeMode} 
                    onChange={(e) => { 
                        setLoadProject(null); 
                        setActiveMode(e.target.value); 
                    }} 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    {Object.keys(gameDevBlueprints).map(key => (
                        <option key={key} value={key}>{gameDevBlueprints[key].title}</option>
                    ))}
                </select>
            </div>
        </ForgeUI>
    );
};

export default GameDevPage;