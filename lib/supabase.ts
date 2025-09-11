import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables with fallbacks
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://tjpfwivbyzaxnlvbxrqc.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqcGZ3aXZieXpheG5sdmJ4cnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MDA1MDUsImV4cCI6MjA3MzE3NjUwNX0.OrSgdnT_mjcZPR2K2UF5vrXYxKJ62DV-xZ4MR8wF2Vo';

// Debug logging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  user_type: 'renter' | 'lender' | 'both';
  id_type?: string;
  id_image_url?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  lender_id: string;
  name: string;
  description: string;
  price_per_day: number;
  category: string;
  location: string;
  rating: number;
  images: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'image' | 'system';
  created_at: string;
}

export interface Conversation {
  id: string;
  item_id: string;
  renter_id: string;
  lender_id: string;
  status: 'pending' | 'approved' | 'declined' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  item_id: string;
  renter_id: string;
  lender_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  start_date: string;
  end_date: string;
  duration_days: number;
  created_at: string;
  updated_at: string;
}
