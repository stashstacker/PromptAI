import React from 'react';
import DevAnalysisReport from '../components/DevAnalysisReport';
import { AssembleIcon, ForgeIcon, LightningIcon } from '../components/icons';

type Page = 'forge' | 'worldbuilder' | 'gamedev' | 'projects' | 'gettingstarted';

interface GettingStartedPageProps {
  setPage: (page: Page) => void;
}

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center fade-in h-full transition-all duration-300 hover:border-orange-500/50 hover:shadow-2xl hover:-translate-y-1">
        <div className="flex justify-center items-center mb-4 h-12 w-12 rounded-full bg-gray-700 mx-auto">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{children}</p>
    </div>
);


const GettingStartedPage: React.FC<GettingStartedPageProps> = ({ setPage }) => {
    return (
        <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Welcome! This is a powerful workspace for crafting perfect AI prompts. Here’s how it works:
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
                <InfoCard
                    icon={<AssembleIcon className="text-orange-400" />}
                    title="1. Add Raw Materials"
                >
                    Start by selecting a blueprint and filling out the form on the left. Provide your core ideas, goals, and constraints. The more detail, the better!
                </InfoCard>

                <InfoCard
                    icon={<ForgeIcon className="text-orange-400" />}
                    title="2. The Forge"
                >
                    Your structured input is automatically assembled into a powerful base prompt in the Forge editor on the right. This is your starting instruction set.
                </InfoCard>

                <InfoCard
                     icon={<LightningIcon className="text-orange-400" />}
                    title="3. Temper & Refine"
                >
                    Use the 'Temper & Refine' section to give the AI further instructions. Ask it to add details, change the tone, or specify a format, then hit 'Forge' to see the result.
                </InfoCard>
            </div>

            <button
                onClick={() => setPage('forge')}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-lg transition-transform duration-200 hover:scale-105 text-lg"
            >
                Start Forging
            </button>

            <div className="mt-12 pt-8 border-t border-gray-700">
                <DevAnalysisReport />
            </div>
        </div>
    );
};

export default GettingStartedPage;