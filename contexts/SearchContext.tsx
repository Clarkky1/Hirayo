import { createContext, ReactNode, useContext, useState } from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  searchHistory: string[];
  addToHistory: (query: string) => void;
  clearHistory: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const addToHistory = (query: string) => {
    if (query.trim() && !searchHistory.includes(query.trim())) {
      setSearchHistory(prev => [query.trim(), ...prev.slice(0, 9)]); // Keep last 10 searches
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const value: SearchContextType = {
    searchQuery,
    setSearchQuery,
    clearSearch,
    searchHistory,
    addToHistory,
    clearHistory,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
