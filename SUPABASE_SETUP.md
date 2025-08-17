# Supabase Setup Guide for Hirayo Rental App

This guide will help you set up Supabase as the backend for your rental app, including all necessary tables, relationships, and SQL code.

## 🚀 Quick Start

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Sign up/Login and create a new project
   - Note down your `Project URL` and `anon public` key

2. **Install Dependencies**
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Environment Setup**
   Create `.env` file in your project root:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

## 🗄️ Database Schema

### Core Tables Structure

```
users (auth.users)
├── profiles (user profiles)
├── items (rental items)
├── categories (item categories)
├── rentals (rental transactions)
├── reviews (user reviews)
├── messages (chat messages)
├── payments (payment records)
└── notifications (user notifications)
```

## 📋 Table Definitions & SQL

### 1. Enable Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
```

### 2. Create Profiles Table
```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_lender BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_rentals INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 3. Create Categories Table
```sql
-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, icon, description) VALUES
  ('Cameras', 'camera', 'Professional and consumer cameras'),
  ('Laptops', 'laptop', 'Laptops and computers'),
  ('Phones', 'phone-portrait', 'Smartphones and mobile devices'),
  ('Drones', 'airplane', 'Drones and aerial equipment'),
  ('Gaming', 'game-controller', 'Gaming consoles and accessories'),
  ('Audio', 'musical-notes', 'Audio equipment and instruments'),
  ('Sports', 'bicycle', 'Sports and fitness equipment'),
  ('Tools', 'construct', 'Tools and DIY equipment'),
  ('Fashion', 'shirt', 'Clothing and accessories'),
  ('Other', 'cube', 'Miscellaneous items');
```

### 4. Create Items Table
```sql
-- Create items table
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_per_day DECIMAL(10,2) NOT NULL,
  price_per_week DECIMAL(10,2),
  price_per_month DECIMAL(10,2),
  images TEXT[], -- Array of image URLs
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  location TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_rentals INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active items" ON items
  FOR SELECT USING (status = 'active');

CREATE POLICY "Lenders can view own items" ON items
  FOR SELECT USING (auth.uid() = lender_id);

CREATE POLICY "Lenders can insert own items" ON items
  FOR INSERT WITH CHECK (auth.uid() = lender_id);

CREATE POLICY "Lenders can update own items" ON items
  FOR UPDATE USING (auth.uid() = lender_id);

CREATE POLICY "Lenders can delete own items" ON items
  FOR DELETE USING (auth.uid() = lender_id);

-- Create indexes
CREATE INDEX idx_items_lender_id ON items(lender_id);
CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_location ON items(latitude, longitude);
```

### 5. Create Rentals Table
```sql
-- Create rentals table
CREATE TABLE rentals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  renter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  pickup_location TEXT,
  return_location TEXT,
  pickup_instructions TEXT,
  return_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own rentals" ON rentals
  FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = lender_id);

CREATE POLICY "Users can insert own rentals" ON rentals
  FOR INSERT WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Users can update own rentals" ON rentals
  FOR UPDATE USING (auth.uid() = renter_id OR auth.uid() = lender_id);

-- Create indexes
CREATE INDEX idx_rentals_item_id ON rentals(item_id);
CREATE INDEX idx_rentals_renter_id ON rentals(renter_id);
CREATE INDEX idx_rentals_lender_id ON rentals(lender_id);
CREATE INDEX idx_rentals_status ON rentals(status);
CREATE INDEX idx_rentals_dates ON rentals(start_date, end_date);
```

### 6. Create Reviews Table
```sql
-- Create reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rental_id UUID REFERENCES rentals(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewed_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);

-- Create indexes
CREATE INDEX idx_reviews_rental_id ON reviews(rental_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewed_id ON reviews(reviewed_id);
CREATE INDEX idx_reviews_item_id ON reviews(item_id);
```

### 7. Create Messages Table
```sql
-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rental_id UUID REFERENCES rentals(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Create indexes
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_rental_id ON messages(rental_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

### 8. Create Payments Table
```sql
-- Create payments table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rental_id UUID REFERENCES rentals(id) ON DELETE CASCADE NOT NULL,
  payer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  payee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'PHP',
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  transaction_id TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = payer_id OR auth.uid() = payee_id);

CREATE POLICY "Users can insert own payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = payer_id);

CREATE POLICY "Users can update own payments" ON payments
  FOR UPDATE USING (auth.uid() = payer_id OR auth.uid() = payee_id);

-- Create indexes
CREATE INDEX idx_payments_rental_id ON payments(rental_id);
CREATE INDEX idx_payments_payer_id ON payments(payer_id);
CREATE INDEX idx_payments_payee_id ON payments(payee_id);
CREATE INDEX idx_payments_status ON payments(status);
```

### 9. Create Notifications Table
```sql
-- Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_id UUID, -- Can reference any related entity
  related_type TEXT, -- Type of related entity
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

## 🔧 Database Functions

### 1. Update Item Statistics
```sql
-- Function to update item statistics
CREATE OR REPLACE FUNCTION update_item_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update item rating and total rentals
  UPDATE items 
  SET 
    rating = (
      SELECT COALESCE(AVG(r.rating), 0.00)
      FROM reviews r
      WHERE r.item_id = NEW.item_id
    ),
    total_rentals = (
      SELECT COUNT(*)
      FROM rentals r
      WHERE r.item_id = NEW.item_id AND r.status = 'completed'
    )
  WHERE id = NEW.item_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for reviews
CREATE TRIGGER update_item_stats_on_review
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE PROCEDURE update_item_stats();

-- Trigger for rentals
CREATE TRIGGER update_item_stats_on_rental
  AFTER INSERT OR UPDATE OR DELETE ON rentals
  FOR EACH ROW EXECUTE PROCEDURE update_item_stats();
```

### 2. Update Profile Statistics
```sql
-- Function to update profile statistics
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile rating and total rentals
  UPDATE profiles 
  SET 
    rating = (
      SELECT COALESCE(AVG(r.rating), 0.00)
      FROM reviews r
      WHERE r.reviewed_id = NEW.reviewed_id
    ),
    total_rentals = (
      SELECT COUNT(*)
      FROM rentals r
      WHERE (r.renter_id = NEW.reviewed_id OR r.lender_id = NEW.reviewed_id) 
        AND r.status = 'completed'
    )
  WHERE id = NEW.reviewed_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for reviews
CREATE TRIGGER update_profile_stats_on_review
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE PROCEDURE update_profile_stats();
```

### 3. Calculate Rental Duration
```sql
-- Function to calculate rental duration
CREATE OR REPLACE FUNCTION calculate_rental_duration(start_date DATE, end_date DATE)
RETURNS INTEGER AS $$
BEGIN
  RETURN end_date - start_date + 1;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate rental amount
CREATE OR REPLACE FUNCTION calculate_rental_amount(item_id UUID, start_date DATE, end_date DATE)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  daily_rate DECIMAL(10,2);
  duration INTEGER;
  total_amount DECIMAL(10,2);
BEGIN
  -- Get daily rate
  SELECT price_per_day INTO daily_rate FROM items WHERE id = item_id;
  
  -- Calculate duration
  duration := calculate_rental_duration(start_date, end_date);
  
  -- Calculate total amount
  total_amount := daily_rate * duration;
  
  RETURN total_amount;
END;
$$ LANGUAGE plpgsql;
```

## 📱 React Native Integration

### 1. Create Supabase Client
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### 2. Authentication Hooks
```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
```

### 3. Database Hooks
```typescript
// hooks/useItems.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          categories(name, icon),
          profiles(full_name, rating)
        `)
        .eq('status', 'active');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  }

  return { items, loading, refetch: fetchItems };
}
```

## 🔐 Row Level Security Policies

### 1. Profiles Policy
```sql
-- Users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 2. Items Policy
```sql
-- Anyone can view active items
CREATE POLICY "Anyone can view active items" ON items
  FOR SELECT USING (status = 'active');

-- Lenders can manage their own items
CREATE POLICY "Lenders can manage own items" ON items
  FOR ALL USING (auth.uid() = lender_id);
```

### 3. Rentals Policy
```sql
-- Users can only see their own rentals
CREATE POLICY "Users can view own rentals" ON rentals
  FOR SELECT USING (
    auth.uid() = renter_id OR 
    auth.uid() = lender_id
  );
```

## 🚀 Deployment Checklist

- [ ] Create Supabase project
- [ ] Run all SQL scripts
- [ ] Set up environment variables
- [ ] Test authentication flow
- [ ] Test CRUD operations
- [ ] Set up RLS policies
- [ ] Test with real data
- [ ] Monitor performance
- [ ] Set up backups

## 📊 Performance Optimization

### 1. Indexes
```sql
-- Composite indexes for common queries
CREATE INDEX idx_items_search ON items(status, category_id, price_per_day);
CREATE INDEX idx_rentals_user_status ON rentals(renter_id, status, created_at);
CREATE INDEX idx_messages_conversation ON messages(sender_id, receiver_id, created_at);
```

### 2. Materialized Views
```sql
-- Create materialized view for popular items
CREATE MATERIALIZED VIEW popular_items AS
SELECT 
  i.id,
  i.name,
  i.rating,
  i.total_rentals,
  i.view_count,
  c.name as category_name
FROM items i
JOIN categories c ON i.category_id = c.id
WHERE i.status = 'active'
ORDER BY i.rating DESC, i.total_rentals DESC;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW popular_items;
```

## 🔍 Monitoring & Analytics

### 1. Enable Supabase Analytics
```sql
-- Enable pg_stat_statements for query monitoring
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Create view for slow queries
CREATE VIEW slow_queries AS
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 20;
```

This setup provides a complete, production-ready backend for your rental app with proper security, performance optimization, and scalability considerations.
