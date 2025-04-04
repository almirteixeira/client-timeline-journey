
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigContextType } from '../lib/types';
import { useLocation } from 'react-router-dom';

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  // Get list_id from URL if available
  const getListIdFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    const urlListId = searchParams.get('id') || searchParams.get('list_id');
    
    if (urlListId) {
      // Save to localStorage when found in URL
      localStorage.setItem('clickup_list_id', urlListId);
      return urlListId;
    }
    
    return localStorage.getItem('clickup_list_id') || '';
  };
  
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('clickup_api_key') || import.meta.env.VITE_CLICKUP_API_KEY || '';
  });
  
  const [listId, setListId] = useState<string>(getListIdFromUrl);
  
  const [visibleItems, setVisibleItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('visible_items');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Update listId if URL parameter changes
  useEffect(() => {
    const newListId = getListIdFromUrl();
    if (newListId && newListId !== listId) {
      setListId(newListId);
    }
  }, [location.search]);

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
