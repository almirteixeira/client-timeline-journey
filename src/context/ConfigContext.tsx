
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigContextType } from '../lib/types';

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('clickup_api_key') || '';
  });
  
  const [listId, setListId] = useState<string>(() => {
    return localStorage.getItem('clickup_list_id') || '';
  });
  
  const [visibleItems, setVisibleItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('visible_items');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('clickup_api_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('clickup_list_id', listId);
  }, [listId]);

  useEffect(() => {
    localStorage.setItem('visible_items', JSON.stringify(visibleItems));
  }, [visibleItems]);

  const toggleItemVisibility = (id: string) => {
    setVisibleItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const value = {
    apiKey,
    setApiKey,
    listId,
    setListId,
    visibleItems,
    toggleItemVisibility,
    loading,
    error
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};
