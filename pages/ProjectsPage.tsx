import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Project } from '../types';
import { projectForgeBlueprints, creativeForgeBlueprints, worldBuilderBlueprints, gameDevBlueprints } from '../constants';
import * as db from '../services/dbService';
import { useProject } from '../contexts/ProjectContext';
import { importProjectFiles } from '../services/projectService';
// FIX: Import ProjectsIcon to be used in the component.
import { DeleteIcon, EditIcon, ImportIcon, LoadIcon, ProjectsIcon } from '../components/icons';

type Page = 'forge' | 'worldbuilder' | 'gamedev' | 'projects';

interface ProjectsPageProps {
  setPage: (page: Page) => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ setPage }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [renameId, setRenameId] = useState<string | null>(null);
    const [newName, setNewName] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { setLoadProject } = useProject();

    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        try {
            const localProjects = await db.getAllProjects();
            setProjects(localProjects.sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()));
        } catch (error) {
            console.error("Failed to load projects:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleLoad = (project: Project) => {
        setLoadProject(project);
        setPage(project.page);
    };

    const handleDelete = async (project: Project) => {
        if (window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
            try {
                await db.deleteProject(project.id);
                setProjects(prev => prev.filter(p => p.id !== project.id));
            } catch (error) {
                console.error("Failed to delete project:", error);
                alert("Error: Could not delete project.");
            }
        }
    };
    
    const startRename = (project: Project) => {
        setRenameId(project.id);
        setNewName(project.name);
    }

    const handleRename = async (projectId: string) => {
        if (!newName.trim()) {
            setRenameId(null);
            return;
        };
        const projectToUpdate = projects.find(p => p.id === projectId);
        if (!projectToUpdate) return;
        
        try {
            const updatedProject = { ...projectToUpdate, name: newName.trim(), lastSaved: new Date().toISOString() };
            await db.updateProject(updatedProject);
            
            setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p).sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()));
        } catch (error) {
            console.error("Failed to rename project:", error);
            alert("Error: Could not rename project.");
        } finally {
            setRenameId(null);
            setNewName('');
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const processFiles = async (files: FileList) => {
        if (!files || files.length === 0) return;
        const { feedbackMessage, loadedProject } = await importProjectFiles(files);
        if (feedbackMessage) alert(feedbackMessage);
        if(loadedProject) {
            setLoadProject(loadedProject);
            setPage(loadedProject.page);
        } else {
            fetchProjects(); // Refresh project list after import
        }
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        await processFiles(event.target.files as FileList);
        if (event.target) event.target.value = '';
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        await processFiles(e.dataTransfer.files);
    };

    const getBlueprintTitle = (project: Project): string => {
        if (project.page === 'forge') {
            return projectForgeBlueprints[project.mode]?.title || creativeForgeBlueprints[project.mode]?.title || 'Unknown Forge Project';
        }
        if (project.page === 'worldbuilder') {
            return worldBuilderBlueprints[project.mode]?.title || 'Unknown WorldBuilder Project';
        }
        if (project.page === 'gamedev') {
            return gameDevBlueprints[project.mode]?.title || 'Unknown Game Dev Project';
        }
        return 'Unknown Project';
    }

    const ActionButton: React.FC<{ onClick: () => void; className: string; children: React.ReactNode, title: string }> = ({ onClick, className, children, title }) => (
        <button onClick={onClick} className={`p-2 rounded-lg transition-colors duration-200 ${className}`} title={title}>
            {children}
        </button>
    );

    return (
        <div 
            className="relative bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-5xl mx-auto"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
             {isDragOver && (
                <div className="absolute inset-0 bg-gray-900/80 border-4 border-dashed border-orange-500 rounded-2xl flex items-center justify-center z-10 pointer-events-none">
                    <div className="text-center">
                        <ImportIcon className="mx-auto h-12 w-12 text-orange-400" />
                        <p className="mt-2 text-2xl font-bold text-orange-400">Drop files to import</p>
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-6">
                <h2 className="text-3xl font-bold text-gray-100">Project Library</h2>
                <button onClick={handleImportClick} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform duration-200 hover:scale-105">
                    <ImportIcon />
                    <span>Import Project(s)</span>
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".json,.txt"
                    multiple
                    className="hidden"
                />
            </div>
            <div className="space-y-4">
                 {isLoading ? <p className="text-gray-400 text-center py-8">Loading projects...</p> :
                 projects.length > 0 ? projects.map((proj: Project) => (
                    <div key={proj.id} className="bg-gray-900/50 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-gray-700 hover:border-orange-500 transition-all duration-200 shadow-lg">
                        <div className="flex-grow">
                            {renameId === proj.id ? (
                                 <input 
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onBlur={() => handleRename(proj.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleRename(proj.id);
                                        if (e.key === 'Escape') setRenameId(null);
                                    }}
                                    className="bg-gray-700 text-white px-3 py-2 rounded-lg w-full sm:w-auto text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    autoFocus
                                />
                            ) : (
                                <h3 className="font-semibold text-lg text-white cursor-pointer hover:text-orange-400" onClick={() => startRename(proj)} title="Click to rename">{proj.name}</h3>
                            )}
                            <p className="text-sm text-gray-400 mt-1">{getBlueprintTitle(proj)} &middot; Last saved: {new Date(proj.lastSaved).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0 self-end sm:self-center items-center">
                            <ActionButton onClick={() => startRename(proj)} className="text-gray-400 hover:text-white hover:bg-gray-700" title="Rename Project">
                                <EditIcon />
                            </ActionButton>
                             <ActionButton onClick={() => handleDelete(proj)} className="text-red-500 hover:text-white hover:bg-red-600" title="Delete Project">
                                <DeleteIcon />
                            </ActionButton>
                            <button onClick={() => handleLoad(proj)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-transform duration-200 hover:scale-105">
                                <LoadIcon />
                                <span>Load</span>
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-16 px-6 bg-gray-900/50 rounded-lg border border-dashed border-gray-700">
                         <ProjectsIcon className="mx-auto h-12 w-12 text-gray-600" />
                         <h3 className="text-xl font-semibold text-white mt-4">Your Library is Empty</h3>
                         <p className="text-gray-400 mt-2">Create a new project in one of the forges to get started!</p>
                         <button onClick={() => setPage('forge')} className="mt-6 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg">
                            Go to the Forge
                         </button>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default ProjectsPage;