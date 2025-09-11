import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthStateContextType {
  isFirstTime: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  setFirstTimeCompleted: () => Promise<void>;
  setAuthenticated: (value: boolean) => Promise<void>;
}

const AuthStateContext = createContext<AuthStateContextType | undefined>(undefined);

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error('useAuthState must be used within an AuthStateProvider');
  }
  return context;
};

interface AuthStateProviderProps {
  children: ReactNode;
}

export const AuthStateProvider: React.FC<AuthStateProviderProps> = ({ children }) => {
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load authentication state on app start
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const [firstTimeValue, authValue] = await Promise.all([
          AsyncStorage.getItem('isFirstTime'),
          AsyncStorage.getItem('isAuthenticated')
        ]);

        setIsFirstTime(firstTimeValue !== 'false');
        setIsAuthenticated(authValue === 'true');
      } catch (error) {
        console.error('Error loading auth state:', error);
        // Default to first time and not authenticated on error
        setIsFirstTime(true);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const setFirstTimeCompleted = async () => {
    try {
      await AsyncStorage.setItem('isFirstTime', 'false');
      setIsFirstTime(false);
    } catch (error) {
      console.error('Error setting first time completed:', error);
    }
  };

  const setAuthenticated = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('isAuthenticated', value.toString());
      setIsAuthenticated(value);
    } catch (error) {
      console.error('Error setting authenticated state:', error);
    }
  };

  return (
    <AuthStateContext.Provider value={{
      isFirstTime,
      isAuthenticated,
      isLoading,
      setFirstTimeCompleted,
      setAuthenticated
    }}>
      {children}
    </AuthStateContext.Provider>
  );
};
