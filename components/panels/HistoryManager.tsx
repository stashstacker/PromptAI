import React, { useState } from 'react';
import { HistoryEntry, HistoryManagerProps } from '../../types';
import HistoryPanel from '../HistoryPanel';
import { ChevronDownIcon } from '../icons';

const HistoryManager: React.FC<HistoryManagerProps> = ({ history, onRestore, onDelete }) => {
    const [showHistory, setShowHistory] = useState(false);
    const [restoredTimestamp, setRestoredTimestamp] = useState<string | null>(null);

    const handleRestoreClick = (entry: HistoryEntry) => {
        onRestore(entry);
        setRestoredTimestamp(entry.timestamp);
        setTimeout(() => {
            setRestoredTimestamp(null);
        }, 1500);
    };

    return (
        <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="flex justify-between items-center">
                 <h3 className="text-xl font-semibold text-gray-200">4. Project History</h3>
                 <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-sm font-medium text-orange-400 hover:text-orange-300 px-3 py-1 rounded-md flex items-center gap-2 transition-colors hover:bg-orange-500/10"
                    aria-expanded={showHistory}
                    aria-controls="history-panel"
                >
                    <ChevronDownIcon className={`transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`} />
                    {showHistory ? 'Hide' : 'Show'} History ({history.length})
                </button>
            </div>
            {showHistory && (
                <div id="history-panel">
                    <HistoryPanel
                        history={history}
                        onRestore={handleRestoreClick}
                        onDelete={onDelete}
                        restoredTimestamp={restoredTimestamp}
                    />
                </div>
            )}
        </div>
    );
};

export default HistoryManager;