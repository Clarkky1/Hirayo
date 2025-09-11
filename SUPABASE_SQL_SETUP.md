# 🗄️ Supabase SQL Setup Guide for Hirayo Rental App

## 📋 Complete Database Setup

Copy and paste these SQL commands into your Supabase SQL Editor to set up your entire database.

### 1. **Enable Extensions**
```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 2. **Create Users Table**
```sql
-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  user_type TEXT CHECK (user_type IN ('renter', 'lender', 'both')) NOT NULL DEFAULT 'renter',
  id_type TEXT,
  id_image_url TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. **Create Items Table**
```sql
-- Create items table
CREATE TABLE items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0.0,
  images TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. **Create Conversations Table**
```sql
-- Create conversations table
CREATE TABLE conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  renter_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  lender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'declined', 'completed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(item_id, renter_id, lender_id)
);
```

### 5. **Create Messages Table**
```sql
-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'image', 'system')) DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. **Create Transactions Table**
```sql
-- Create transactions table
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  renter_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  lender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')) DEFAULT 'pending',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_days INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. **Create Saved Items Table**
```sql
-- Create saved_items table
CREATE TABLE saved_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);
```

### 8. **Create Indexes for Performance**
```sql
-- Create indexes for better performance
CREATE INDEX idx_items_lender_id ON items(lender_id);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_location ON items(location);
CREATE INDEX idx_items_is_available ON items(is_available);
CREATE INDEX idx_conversations_renter_id ON conversations(renter_id);
CREATE INDEX idx_conversations_lender_id ON conversations(lender_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_transactions_renter_id ON transactions(renter_id);
CREATE INDEX idx_transactions_lender_id ON transactions(lender_id);
CREATE INDEX idx_saved_items_user_id ON saved_items(user_id);
```

### 9. **Create Updated_at Trigger Function**
```sql
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';
```

### 10. **Apply Updated_at Triggers**
```sql
-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 11. **Enable Row Level Security (RLS)**
```sql
-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;
```

### 12. **Create RLS Policies**
```sql
-- Create RLS policies
-- Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Items are publicly readable, only lenders can modify their own items
CREATE POLICY "Items are publicly readable" ON items FOR SELECT USING (true);
CREATE POLICY "Lenders can insert their own items" ON items FOR INSERT WITH CHECK (auth.uid() = lender_id);
CREATE POLICY "Lenders can update their own items" ON items FOR UPDATE USING (auth.uid() = lender_id);
CREATE POLICY "Lenders can delete their own items" ON items FOR DELETE USING (auth.uid() = lender_id);

-- Conversations: users can only see conversations they're part of
CREATE POLICY "Users can view their conversations" ON conversations FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = lender_id);
CREATE POLICY "Users can create conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = renter_id);
CREATE POLICY "Lenders can update conversation status" ON conversations FOR UPDATE USING (auth.uid() = lender_id);

-- Messages: users can only see messages from their conversations
CREATE POLICY "Users can view messages from their conversations" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.renter_id = auth.uid() OR conversations.lender_id = auth.uid())
  )
);
CREATE POLICY "Users can send messages to their conversations" ON messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.renter_id = auth.uid() OR conversations.lender_id = auth.uid())
  )
);

-- Transactions: users can only see their own transactions
CREATE POLICY "Users can view their transactions" ON transactions FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = lender_id);
CREATE POLICY "Users can create transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = renter_id);
CREATE POLICY "Users can update their transactions" ON transactions FOR UPDATE USING (auth.uid() = renter_id OR auth.uid() = lender_id);

-- Saved items: users can only see and manage their own saved items
CREATE POLICY "Users can view their saved items" ON saved_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their saved items" ON saved_items FOR ALL USING (auth.uid() = user_id);
```

### 13. **Create Storage Bucket for Images**
```sql
-- Note: This needs to be done in the Supabase Dashboard under Storage
-- Go to Storage > Create Bucket
-- Name: item-images
-- Public: Yes
```

### 14. **Sample Data (Optional)**
```sql
-- Insert sample data for testing (optional)
-- Note: Replace with actual user IDs from your auth.users table

-- Sample items (replace lender_id with actual user ID)
INSERT INTO items (lender_id, name, description, price_per_day, category, location, rating, images) VALUES
('your-user-id-here', 'MacBook Pro M2 14-inch', 'Perfect for work and creative projects', 2500.00, 'laptop', 'Cebu City', 4.8, ARRAY['https://example.com/macbook1.jpg', 'https://example.com/macbook2.jpg']),
('your-user-id-here', 'Canon EOS R5 Camera', 'Professional mirrorless camera', 1800.00, 'camera', 'Mandaue City', 4.9, ARRAY['https://example.com/canon1.jpg']),
('your-user-id-here', 'iPhone 15 Pro Max', 'Latest iPhone with amazing camera', 1200.00, 'phone', 'Lapu-Lapu City', 4.7, ARRAY['https://example.com/iphone1.jpg']),
('your-user-id-here', 'DJI Mavic 3 Pro Drone', 'Professional drone for aerial photography', 3000.00, 'drone', 'Talisay City', 4.9, ARRAY['https://example.com/drone1.jpg', 'https://example.com/drone2.jpg']);
```

## 🚀 **Setup Instructions:**

1. **Open Supabase Dashboard** → Go to your project
2. **Navigate to SQL Editor** (left sidebar)
3. **Copy and paste each SQL block above** in order
4. **Click "Run"** after each block
5. **Go to Storage** → Create bucket named `item-images` (set to public)

## ✅ **Verification:**

After running all SQL commands, verify your setup:

```sql
-- Check if all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'items', 'conversations', 'messages', 'transactions', 'saved_items');

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 🔐 **Security Features:**

- ✅ **Row Level Security** - Users can only access their own data
- ✅ **Public Item Listings** - Anyone can browse items
- ✅ **Secure Messaging** - Only conversation participants can see messages
- ✅ **Transaction Privacy** - Users only see their own transactions
- ✅ **Saved Items Privacy** - Users only see their own saved items

## 📱 **Ready for Your App!**

Your database is now ready to power your Hirayo rental app with:
- User authentication and profiles
- Item listings and management
- Real-time messaging
- Transaction tracking
- Saved items functionality
- Secure data access

**Next Step:** Update your `.env` file with your Supabase credentials and test your app! 🚀
