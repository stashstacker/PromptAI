import React, { useState, createContext, useContext, ReactNode } from 'react';
import { Project } from '../types';

interface ProjectContextType {
  loadedProject: Project | null;
  setLoadProject: (project: Project | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loadedProject, setLoadProject] = useState<Project | null>(null);

  return (
    <ProjectContext.Provider value={{ loadedProject, setLoadProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};