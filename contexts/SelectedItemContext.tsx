import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface SelectedItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  location: string;
  image?: string;
  category?: string;
}

interface SelectedItemContextType {
  selectedItem: SelectedItem | null;
  setSelectedItem: (item: SelectedItem | null) => void;
}

const SelectedItemContext = createContext<SelectedItemContextType | undefined>(undefined);

export const useSelectedItem = () => {
  const context = useContext(SelectedItemContext);
  if (!context) {
    throw new Error('useSelectedItem must be used within a SelectedItemProvider');
  }
  return context;
};

interface SelectedItemProviderProps {
  children: ReactNode;
}

export const SelectedItemProvider: React.FC<SelectedItemProviderProps> = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  return (
    <SelectedItemContext.Provider value={{
      selectedItem,
      setSelectedItem,
    }}>
      {children}
    </SelectedItemContext.Provider>
  );
};
