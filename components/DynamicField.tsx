
import React, { useState } from 'react';
import { Field } from '../types';

interface DynamicFieldProps {
  field: Field;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

const DynamicField: React.FC<DynamicFieldProps> = ({ field, value, onChange }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleListChange = (index: number, newValue: string) => {
    const newList = [...(Array.isArray(value) ? value : [])];
    newList[index] = newValue;
    onChange(newList);
  };

  const addListItem = () => {
    onChange([...(Array.isArray(value) ? value : []), '']);
  };

  const removeListItem = (index: number) => {
    const newList = (Array.isArray(value) ? value : []).filter((_, i) => i !== index);
    onChange(newList);
  };

  const handleDragSort = () => {
    if (draggedIndex === null || dragOverIndex === null || draggedIndex === dragOverIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const list = [...(Array.isArray(value) ? value : [])];
    const draggedItem = list.splice(draggedIndex, 1)[0];
    list.splice(dragOverIndex, 0, draggedItem);
    onChange(list);
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="mb-6 fade-in">
      <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-2">{field.label}</label>
      {field.type === 'input' && (
        <input
          type="text"
          id={field.id}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder={field.placeholder}
        />
      )}
      {field.type === 'textarea' && (
        <textarea
          id={field.id}
          rows={3}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder={field.placeholder}
        ></textarea>
      )}
      {field.type === 'list' && (
        <div>
          {(Array.isArray(value) ? value : []).map((item, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragEnter={() => setDragOverIndex(index)}
              onDragEnd={handleDragSort}
              onDragOver={(e) => e.preventDefault()}
              className={`flex items-center gap-2 mb-2 fade-in group p-2 rounded-lg bg-gray-800/50 border transition-all duration-200 ease-in-out
                ${draggedIndex === index ? 'opacity-50 shadow-lg' : ''}
                ${dragOverIndex === index ? 'border-orange-500' : 'border-transparent hover:border-gray-600'}
              `}
            >
              <div className="cursor-grab text-gray-500 group-hover:text-gray-300 transition-colors" title="Drag to reorder">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
              </div>
              <input
                type="text"
                value={item}
                onChange={(e) => handleListChange(index, e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={field.placeholder}
              />
              <button onClick={() => removeListItem(index)} className="text-red-500 hover:text-red-400 p-1 rounded-full flex-shrink-0" title="Remove item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708 .708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
              </button>
            </div>
          ))}
          <button onClick={addListItem} className="mt-2 text-sm text-orange-400 hover:text-orange-300 font-medium">+ Add Item</button>
        </div>
      )}
    </div>
  );
};

export default DynamicField;
