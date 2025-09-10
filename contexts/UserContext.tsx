import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface UserProfile {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
  profileImage?: string;
  memberSince: string;
  bio?: string;
  location?: string;
  preferences: {
    notifications: {
      push: boolean;
      email: boolean;
      sms: boolean;
    };
    privacy: {
      showProfile: boolean;
      showActivity: boolean;
      showLocation: boolean;
    };
    rental: {
      autoAccept: boolean;
      instantBooking: boolean;
    };
  };
  stats: {
    totalRentals: number;
    totalEarnings: number;
    rating: number;
    reviewsCount: number;
    itemsListed: number;
  };
}

interface UserContextType {
  profile: UserProfile | null;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updatePreferences: (category: keyof UserProfile['preferences'], updates: any) => void;
  updateStats: (updates: Partial<UserProfile['stats']>) => void;
  loadProfile: () => Promise<void>;
  saveProfile: () => Promise<void>;
  clearProfile: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

const defaultProfile: UserProfile = {
  id: '1',
  firstName: 'Kin Clark',
  surname: 'Perez',
  email: 'clarkperez906@gmail.com',
  phoneNumber: '+63 912 345 6789',
  dateOfBirth: 'March 15, 1995',
  address: '123 Main Street, Quezon City, Philippines',
  emergencyContact: '+63 998 765 4321',
  memberSince: 'August 2024',
  bio: 'Tech enthusiast and gadget lover. Always looking for the latest devices to try!',
  location: 'Quezon City, Philippines',
  preferences: {
    notifications: {
      push: true,
      email: true,
      sms: false,
    },
    privacy: {
      showProfile: true,
      showActivity: true,
      showLocation: false,
    },
    rental: {
      autoAccept: false,
      instantBooking: true,
    },
  },
  stats: {
    totalRentals: 12,
    totalEarnings: 15600,
    rating: 4.8,
    reviewsCount: 24,
    itemsListed: 3,
  },
};

export function UserProvider({ children }: UserProviderProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        // Use default profile if no saved data
        setProfile(defaultProfile);
        await AsyncStorage.setItem('userProfile', JSON.stringify(defaultProfile));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(defaultProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    if (profile) {
      try {
        await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      saveProfile(); // Auto-save
      return updated;
    });
  };

  const updatePreferences = (category: keyof UserProfile['preferences'], updates: any) => {
    setProfile(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        preferences: {
          ...prev.preferences,
          [category]: {
            ...prev.preferences[category],
            ...updates,
          },
        },
      };
      saveProfile(); // Auto-save
      return updated;
    });
  };

  const updateStats = (updates: Partial<UserProfile['stats']>) => {
    setProfile(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        stats: {
          ...prev.stats,
          ...updates,
        },
      };
      saveProfile(); // Auto-save
      return updated;
    });
  };

  const clearProfile = () => {
    setProfile(null);
    AsyncStorage.removeItem('userProfile');
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const value: UserContextType = {
    profile,
    updateProfile,
    updatePreferences,
    updateStats,
    loadProfile,
    saveProfile,
    clearProfile,
    isLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
