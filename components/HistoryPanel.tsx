import React from 'react';
import { HistoryEntry } from '../types';
import { DeleteIcon, RestoreIcon } from './icons';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
  onDelete: (timestamp: string) => void;
  restoredTimestamp: string | null;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onRestore, onDelete, restoredTimestamp }) => {
  if (history.length === 0) {
    return <p className="text-gray-400 text-center py-4">No history recorded yet. Forge a prompt to start the log.</p>;
  }

  return (
    <div className="mt-4 max-h-96 overflow-y-auto bg-gray-900/50 p-3 rounded-lg border border-gray-700">
      <ul className="space-y-2">
        {[...history].reverse().map((entry) => (
          <li 
            key={entry.timestamp} 
            className={`p-3 rounded-lg flex justify-between items-center gap-4 fade-in hover:bg-gray-700/50 transition-all duration-300 ease-in-out ${
              entry.timestamp === restoredTimestamp
                ? 'bg-green-800/50 border-l-4 border-green-500'
                : 'bg-gray-800'
            }`}
          >
            <div className="flex-grow min-w-0">
              <p className="text-sm font-semibold text-gray-200 truncate" title={entry.refineInput}>
                {entry.refineInput}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(entry.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="flex-shrink-0 flex gap-2">
              <button
                onClick={() => onRestore(entry)}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-md transition-colors flex items-center gap-1"
                aria-label={`Restore version from ${new Date(entry.timestamp).toLocaleString()}`}
              >
                <RestoreIcon />
                Restore
              </button>
              <button
                onClick={() => onDelete(entry.timestamp)}
                className="text-xs bg-gray-600 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md transition-colors flex items-center gap-1"
                aria-label={`Delete version from ${new Date(entry.timestamp).toLocaleString()}`}
              >
                <DeleteIcon />
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryPanel;