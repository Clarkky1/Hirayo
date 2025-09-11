import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted state on mount
  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const [isLenderValue, hasClickedValue] = await Promise.all([
          AsyncStorage.getItem('isLender'),
          AsyncStorage.getItem('hasClickedGetStarted')
        ]);
        
        if (isLenderValue !== null) {
          setIsLender(JSON.parse(isLenderValue));
        }
        if (hasClickedValue !== null) {
          setHasClickedGetStarted(JSON.parse(hasClickedValue));
        }
      } catch (error) {
        console.error('Error loading persisted lender state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersistedState();
  }, []);

  // Persist state changes
  const handleSetIsLender = async (value: boolean) => {
    setIsLender(value);
    try {
      await AsyncStorage.setItem('isLender', JSON.stringify(value));
    } catch (error) {
      console.error('Error persisting isLender state:', error);
    }
  };

  const handleSetHasClickedGetStarted = async (value: boolean) => {
    setHasClickedGetStarted(value);
    try {
      await AsyncStorage.setItem('hasClickedGetStarted', JSON.stringify(value));
    } catch (error) {
      console.error('Error persisting hasClickedGetStarted state:', error);
    }
  };

  // Don't render children until state is loaded
  if (isLoading) {
    return null;
  }

  return (
    <LenderContext.Provider value={{ 
      isLender, 
      setIsLender: handleSetIsLender, 
      hasClickedGetStarted, 
      setHasClickedGetStarted: handleSetHasClickedGetStarted 
    }}>
      {children}
    </LenderContext.Provider>
  );
};
