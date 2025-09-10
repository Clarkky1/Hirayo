import { createContext, ReactNode, useContext, useState } from 'react';

interface LenderContextType {
  isLender: boolean;
  setIsLender: (value: boolean) => void;
  hasClickedGetStarted: boolean;
  setHasClickedGetStarted: (value: boolean) => void;
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
  const [hasClickedGetStarted, setHasClickedGetStarted] = useState(false);

  return (
    <LenderContext.Provider value={{ 
      isLender, 
      setIsLender, 
      hasClickedGetStarted, 
      setHasClickedGetStarted 
    }}>
      {children}
    </LenderContext.Provider>
  );
};
