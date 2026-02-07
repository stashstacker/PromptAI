
import { useState, useCallback } from 'react';
import { HistoryEntry } from '../types';

export const useProjectHistory = (initialHistory: HistoryEntry[] = []) => {
  const [history, setHistory] = useState<HistoryEntry[]>(initialHistory);

  const addHistoryEntry = useCallback((entry: HistoryEntry) => {
    setHistory(prev => [...prev, entry]);
  }, []);
  
  const deleteHistoryEntry = useCallback((timestamp: string) => {
    setHistory(prev => prev.filter(e => e.timestamp !== timestamp));
  }, []);

  const clearHistory = useCallback(() => {
      setHistory([]);
  }, []);

  const resetHistoryWithEntry = useCallback((entry: HistoryEntry) => {
    setHistory([entry]);
  }, []);

  return { 
    history, 
    setHistory, 
    addHistoryEntry, 
    deleteHistoryEntry,
    clearHistory,
    resetHistoryWithEntry,
  };
};
