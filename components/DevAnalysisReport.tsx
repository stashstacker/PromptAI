import React, { useState } from 'react';
import { generateDevAnalysis } from '../services/geminiService';
import { SpinnerIcon } from './icons';

const DevAnalysisReport: React.FC = () => {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportContent, setReportContent] = useState('');
    const [isReportLoading, setIsReportLoading] = useState(false);
    const [reportError, setReportError] = useState('');

    const handleGenerateReport = async () => {
        setIsReportLoading(true);
        setReportError('');
        setReportContent('');
        try {
            const report = await generateDevAnalysis();
            // Basic markdown to HTML conversion
            const htmlContent = report
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*)\*/g, '<em>$1</em>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
                .replace(/^\* (.*$)/gim, '<li>$1</li>')
                .replace(/(\r\n|\n|\r)/gm, '<br>');

            setReportContent(htmlContent);
            setIsReportModalOpen(true);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setReportError(`Failed to generate report: ${errorMessage}`);
            console.error(err);
        } finally {
            setIsReportLoading(false);
        }
    };
    
    const DevReportModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-3xl border border-gray-600 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h3 className="text-xl font-semibold text-white">Development Analysis Report</h3>
                    <button onClick={() => setIsReportModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                    </button>
                </div>
                <div className="overflow-y-auto bg-gray-900/50 p-6 rounded-lg border border-gray-700 prose prose-invert prose-sm max-w-none">
                    {reportError ? (
                        <p className="text-red-400">{reportError}</p>
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: reportContent }} />
                    )}
                </div>
                <div className="mt-4 flex justify-end flex-shrink-0">
                    <button onClick={() => setIsReportModalOpen(false)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Close</button>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <p className="text-sm text-gray-500 mb-2">For Development Use Only</p>
            <button
                onClick={handleGenerateReport}
                disabled={isReportLoading}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 font-mono text-sm py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
            >
                {isReportLoading 
                    ? <><SpinnerIcon /> <span>Generating...</span></>
                    : 'Analyze Application'
                }
            </button>
            {reportError && !isReportModalOpen && <p className="text-red-400 text-sm mt-2">{reportError}</p>}
            {isReportModalOpen && <DevReportModal />}
        </div>
    );
};

export default DevAnalysisReport;