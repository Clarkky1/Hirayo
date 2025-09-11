import { createContext, ReactNode, useContext, useState } from 'react';

export interface SavedItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  location: string;
  image?: string;
  category?: string;
  description?: string;
  ownerName?: string;
  ownerAvatar?: string;
}

interface SavedItemsContextType {
  savedItems: SavedItem[];
  addSavedItem: (item: SavedItem) => void;
  removeSavedItem: (itemId: string) => void;
  isItemSaved: (itemId: string) => boolean;
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined);

export const useSavedItems = () => {
  const context = useContext(SavedItemsContext);
  if (!context) {
    throw new Error('useSavedItems must be used within a SavedItemsProvider');
  }
  return context;
};

interface SavedItemsProviderProps {
  children: ReactNode;
}

export const SavedItemsProvider: React.FC<SavedItemsProviderProps> = ({ children }) => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  const addSavedItem = (item: SavedItem) => {
    setSavedItems(prev => {
      if (prev.find(savedItem => savedItem.id === item.id)) {
        return prev; // Item already saved
      }
      return [...prev, item];
    });
  };

  const removeSavedItem = (itemId: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const isItemSaved = (itemId: string) => {
    return savedItems.some(item => item.id === itemId);
  };

  return (
    <SavedItemsContext.Provider value={{
      savedItems,
      addSavedItem,
      removeSavedItem,
      isItemSaved,
    }}>
      {children}
    </SavedItemsContext.Provider>
  );
};
