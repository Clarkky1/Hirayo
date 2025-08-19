import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LenderContextType {
  isLender: boolean;
  setIsLender: (value: boolean) => void;
}

const LenderContext = createContext<LenderContextType | undefined>(undefined);

export const useLender = () => {
  const context = useContext(LenderContext);
  if (context === undefined) {
    throw new Error('useLender must be used within a LenderProvider');
  }
  return context;
};

interface LenderProviderProps {
  children: ReactNode;
}

export const LenderProvider: React.FC<LenderProviderProps> = ({ children }) => {
  const [isLender, setIsLender] = useState(false);

  return (
    <LenderContext.Provider value={{ isLender, setIsLender }}>
      {children}
    </LenderContext.Provider>
  );
};
