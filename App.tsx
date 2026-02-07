import React, { useState } from 'react';
import { ProjectProvider, useProject } from './contexts/ProjectContext';
import NavButton from './components/NavButton';
import InstructionSetForgePage from './pages/InstructionSetForgePage';
import WorldBuilderPage from './pages/WorldBuilderPage';
import ProjectsPage from './pages/ProjectsPage';
import GameDevPage from './pages/GameDevPage';
import GettingStartedPage from './pages/GettingStartedPage';
import { ForgeIcon, GameDevIcon, ProjectsIcon, WorldBuilderIcon } from './components/icons';

type Page = 'forge' | 'worldbuilder' | 'gamedev' | 'projects' | 'gettingstarted';

const AppContent: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('gettingstarted');
    const { setLoadProject } = useProject();

    const handleNavClick = (page: string) => {
        setCurrentPage(page as Page);
        setLoadProject(null);
    }

    const pageTitles: Record<Page, string> = {
        gettingstarted: 'Welcome',
        forge: 'Instruction Set Forge',
        worldbuilder: 'WorldBuilder',
        gamedev: 'Game Development Forge',
        projects: 'Project Library'
    };

    const icons: Record<string, React.ReactNode> = {
        forge: <ForgeIcon />,
        worldbuilder: <WorldBuilderIcon />,
        gamedev: <GameDevIcon />,
        projects: <ProjectsIcon />,
    };
    
    const renderPage = () => {
        switch (currentPage) {
            case 'gettingstarted':
                return <GettingStartedPage setPage={setCurrentPage} />;
            case 'forge':
                return <InstructionSetForgePage />;
            case 'worldbuilder':
                return <WorldBuilderPage />;
            case 'gamedev':
                return <GameDevPage />;
            case 'projects':
                return <ProjectsPage setPage={setCurrentPage} />;
            default:
                return <GettingStartedPage setPage={setCurrentPage} />;
        }
    };

    return (
        <div className="bg-gray-900 text-white antialiased min-h-screen">
            <div className="container mx-auto max-w-7xl px-4 py-8">
                 <header className="flex justify-between items-center mb-10 flex-wrap gap-4 border-b border-gray-800 pb-6">
                    <div className="text-left">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-600">
                           Prompt Forge AI
                        </h1>
                         <p className="text-sm text-gray-500">{pageTitles[currentPage]}</p>
                    </div>
                     {currentPage !== 'gettingstarted' && (
                        <nav className="flex justify-center gap-1 sm:gap-2 bg-gray-800/50 p-1 rounded-lg border border-gray-700 order-last w-full md:order-none md:w-auto">
                            <NavButton page="forge" currentPage={currentPage} onClick={handleNavClick} icon={icons.forge}>Instruction Forge</NavButton>
                            <NavButton page="worldbuilder" currentPage={currentPage} onClick={handleNavClick} icon={icons.worldbuilder}>WorldBuilder</NavButton>
                            <NavButton page="gamedev" currentPage={currentPage} onClick={handleNavClick} icon={icons.gamedev}>Game Dev</NavButton>
                            <NavButton page="projects" currentPage={currentPage} onClick={handleNavClick} icon={icons.projects}>Projects</NavButton>
                        </nav>
                    )}
                    <div className="ml-auto">
                        {/* Auth UI removed */}
                    </div>
                </header>

                {renderPage()}
            </div>
        </div>
    );
}

export default function App() {
    return (
        <ProjectProvider>
            <AppContent />
        </ProjectProvider>
    );
}