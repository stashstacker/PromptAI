
import React, { useState } from 'react';

interface SaveModalProps {
  show: boolean;
  onSave: (projectName: string) => void | Promise<void>;
  onCancel: () => void;
}

const SaveModal: React.FC<SaveModalProps> = ({ show, onSave, onCancel }) => {
  const [projectName, setProjectName] = useState('');

  if (!show) return null;

  const handleSave = async () => {
    if (projectName.trim()) {
      await onSave(projectName.trim());
      setProjectName('');
    } else {
      await onSave('project'); // Default name if empty
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4 text-white">Export Project as .json</h3>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter file name..."
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
          <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">Export</button>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;