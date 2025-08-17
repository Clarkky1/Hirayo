// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Item types
export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
  images: string[];
  ownerId: string;
  location: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Rental types
export interface Rental {
  id: string;
  itemId: string;
  renterId: string;
  startDate: Date;
  endDate: Date;
  totalCost: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Message types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

// Navigation types
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Profile: undefined;
  Messages: undefined;
  Saved: undefined;
  Transactions: undefined;
  Laptop: undefined;
  Phone: undefined;
  Tablet: undefined;
  PC: undefined;
  Gaming: undefined;
  Camera: undefined;
  Drone: undefined;
  Audio: undefined;
};
