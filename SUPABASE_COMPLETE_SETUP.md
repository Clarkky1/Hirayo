# 🗄️ Hirayo Rental App - Complete Supabase SQL Setup

## 📋 Overview

This comprehensive SQL setup covers all the database tables, relationships, and features used in the Hirayo rental platform. The system supports:

- **User Management**: Authentication, profiles, verification
- **Item Management**: Rental items with categories, images, availability
- **Communication System**: Messages, conversations, video calls
- **Rental System**: Requests, transactions, payments
- **Review System**: Ratings and reviews for items and users
- **Payment System**: Multiple payment methods and transaction tracking
- **Analytics**: Lender analytics, earnings, and performance metrics

---

## 🚀 Complete Database Setup

### 1. **Enable Extensions**
```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### 2. **Create Users Table**
```sql
-- Create users table with comprehensive profile data
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  user_type TEXT CHECK (user_type IN ('renter', 'lender', 'both')) NOT NULL DEFAULT 'renter',
  id_type TEXT CHECK (id_type IN ('government', 'student', 'passport', 'driver')),
  id_image_url TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. **Create Items Table**
```sql
-- Create items table for rental items
CREATE TABLE items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  location TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  condition_status TEXT CHECK (condition_status IN ('excellent', 'good', 'fair', 'poor')) DEFAULT 'good',
  deposit_amount DECIMAL(10,2) DEFAULT 0,
  minimum_rental_days INTEGER DEFAULT 1,
  maximum_rental_days INTEGER DEFAULT 30,
  views INTEGER DEFAULT 0,
  total_rentals INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. **Create Conversations Table**
```sql
-- Create conversations table for rental discussions
CREATE TABLE conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  renter_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  lender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'declined', 'completed', 'cancelled')) DEFAULT 'pending',
  permission_granted BOOLEAN DEFAULT FALSE,
  permission_granted_at TIMESTAMP WITH TIME ZONE,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(item_id, renter_id, lender_id)
);
```

### 5. **Create Messages Table**
```sql
-- Create messages table for communication
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'image', 'system', 'permission_granted', 'permission_denied')) DEFAULT 'text',
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. **Create Rental Requests Table**
```sql
-- Create rental_requests table for rental requests
CREATE TABLE rental_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  renter_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  lender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_days INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'declined', 'cancelled', 'expired')) DEFAULT 'pending',
  message TEXT,
  special_requests TEXT,
  is_first_request BOOLEAN DEFAULT TRUE,
  priority_order INTEGER DEFAULT 1,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. **Create Transactions Table**
```sql
-- Create transactions table for payment tracking
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  renter_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  lender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  rental_request_id UUID REFERENCES rental_requests(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded', 'failed')) DEFAULT 'pending',
  payment_method_id UUID,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_days INTEGER NOT NULL,
  transaction_fee DECIMAL(10,2) DEFAULT 0,
  platform_fee DECIMAL(10,2) DEFAULT 0,
  lender_earnings DECIMAL(10,2) DEFAULT 0,
  payment_intent_id TEXT,
  stripe_charge_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. **Create Payment Methods Table**
```sql
-- Create payment_methods table for user payment options
CREATE TABLE payment_methods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('credit_card', 'debit_card', 'digital_wallet')) NOT NULL,
  provider TEXT NOT NULL,
  last4 TEXT NOT NULL,
  expiry_month INTEGER,
  expiry_year INTEGER,
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  balance DECIMAL(10,2) DEFAULT 0,
  wallet_id TEXT,
  stripe_payment_method_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 9. **Create Reviews Table**
```sql
-- Create reviews table for item and user reviews
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT,
  comment TEXT,
  review_type TEXT CHECK (review_type IN ('item', 'lender', 'renter')) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(transaction_id, reviewer_id, review_type)
);
```

### 10. **Create Saved Items Table**
```sql
-- Create saved_items table for user favorites
CREATE TABLE saved_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);
```

### 11. **Create Video Calls Table**
```sql
-- Create video_calls table for video call tracking
CREATE TABLE video_calls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  initiator_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('initiated', 'connected', 'ended', 'failed', 'declined')) DEFAULT 'initiated',
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER DEFAULT 0,
  connection_quality TEXT CHECK (connection_quality IN ('excellent', 'good', 'poor', 'failed')),
  call_room_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 12. **Create Notifications Table**
```sql
-- Create notifications table for user notifications
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('rental_request', 'message', 'payment', 'review', 'system')) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 13. **Create Categories Table**
```sql
-- Create categories table for item categorization
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES categories(id),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, description, icon) VALUES
('Electronics', 'Electronic devices and gadgets', 'phone-portrait-outline'),
('Photography', 'Cameras, lenses, and photography equipment', 'camera-outline'),
('Gaming', 'Gaming consoles, accessories, and games', 'game-controller-outline'),
('Sports & Fitness', 'Sports equipment and fitness gear', 'fitness-outline'),
('Home & Garden', 'Home improvement and gardening tools', 'home-outline'),
('Transportation', 'Vehicles and transportation equipment', 'car-outline'),
('Fashion', 'Clothing, accessories, and fashion items', 'shirt-outline'),
('Tools', 'Professional and DIY tools', 'construct-outline'),
('Entertainment', 'Musical instruments and entertainment equipment', 'musical-notes-outline'),
('Other', 'Miscellaneous items', 'ellipsis-horizontal-outline');
```

### 14. **Create User Settings Table**
```sql
-- Create user_settings table for user preferences
CREATE TABLE user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  currency TEXT DEFAULT 'PHP',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔧 Create Indexes for Performance

```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_is_verified ON users(is_verified);

-- Items table indexes
CREATE INDEX idx_items_lender_id ON items(lender_id);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_location ON items(location);
CREATE INDEX idx_items_is_available ON items(is_available);
CREATE INDEX idx_items_rating ON items(rating);
CREATE INDEX idx_items_price_per_day ON items(price_per_day);
CREATE INDEX idx_items_created_at ON items(created_at);

-- Conversations table indexes
CREATE INDEX idx_conversations_renter_id ON conversations(renter_id);
CREATE INDEX idx_conversations_lender_id ON conversations(lender_id);
CREATE INDEX idx_conversations_item_id ON conversations(item_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at);

-- Messages table indexes
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_is_read ON messages(is_read);

-- Rental requests table indexes
CREATE INDEX idx_rental_requests_item_id ON rental_requests(item_id);
CREATE INDEX idx_rental_requests_renter_id ON rental_requests(renter_id);
CREATE INDEX idx_rental_requests_lender_id ON rental_requests(lender_id);
CREATE INDEX idx_rental_requests_status ON rental_requests(status);
CREATE INDEX idx_rental_requests_created_at ON rental_requests(created_at);
CREATE INDEX idx_rental_requests_priority_order ON rental_requests(priority_order);

-- Transactions table indexes
CREATE INDEX idx_transactions_renter_id ON transactions(renter_id);
CREATE INDEX idx_transactions_lender_id ON transactions(lender_id);
CREATE INDEX idx_transactions_item_id ON transactions(item_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Payment methods table indexes
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_type ON payment_methods(type);
CREATE INDEX idx_payment_methods_is_default ON payment_methods(is_default);
CREATE INDEX idx_payment_methods_is_active ON payment_methods(is_active);

-- Reviews table indexes
CREATE INDEX idx_reviews_item_id ON reviews(item_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_review_type ON reviews(review_type);

-- Saved items table indexes
CREATE INDEX idx_saved_items_user_id ON saved_items(user_id);
CREATE INDEX idx_saved_items_item_id ON saved_items(item_id);

-- Video calls table indexes
CREATE INDEX idx_video_calls_conversation_id ON video_calls(conversation_id);
CREATE INDEX idx_video_calls_initiator_id ON video_calls(initiator_id);
CREATE INDEX idx_video_calls_receiver_id ON video_calls(receiver_id);
CREATE INDEX idx_video_calls_status ON video_calls(status);

-- Notifications table indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

---

## 🔒 Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Items table policies
CREATE POLICY "Anyone can view available items" ON items
  FOR SELECT USING (is_available = true);

CREATE POLICY "Lenders can view their own items" ON items
  FOR SELECT USING (auth.uid() = lender_id);

CREATE POLICY "Lenders can insert their own items" ON items
  FOR INSERT WITH CHECK (auth.uid() = lender_id);

CREATE POLICY "Lenders can update their own items" ON items
  FOR UPDATE USING (auth.uid() = lender_id);

CREATE POLICY "Lenders can delete their own items" ON items
  FOR DELETE USING (auth.uid() = lender_id);

-- Conversations table policies
CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = lender_id);

CREATE POLICY "Users can insert conversations where they are renter" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Users can update conversations they are part of" ON conversations
  FOR UPDATE USING (auth.uid() = renter_id OR auth.uid() = lender_id);

-- Messages table policies
CREATE POLICY "Users can view messages in their conversations" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE id = messages.conversation_id 
      AND (renter_id = auth.uid() OR lender_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert messages in their conversations" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE id = messages.conversation_id 
      AND (renter_id = auth.uid() OR lender_id = auth.uid())
    )
  );

-- Rental requests table policies
CREATE POLICY "Users can view their own rental requests" ON rental_requests
  FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = lender_id);

CREATE POLICY "Renters can insert rental requests" ON rental_requests
  FOR INSERT WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Lenders can update rental requests for their items" ON rental_requests
  FOR UPDATE USING (auth.uid() = lender_id);

-- Transactions table policies
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = lender_id);

CREATE POLICY "Users can insert transactions they are part of" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = renter_id OR auth.uid() = lender_id);

-- Payment methods table policies
CREATE POLICY "Users can view their own payment methods" ON payment_methods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods" ON payment_methods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods" ON payment_methods
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods" ON payment_methods
  FOR DELETE USING (auth.uid() = user_id);

-- Reviews table policies
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert reviews for their transactions" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM transactions 
      WHERE id = reviews.transaction_id 
      AND (renter_id = auth.uid() OR lender_id = auth.uid())
    )
  );

-- Saved items table policies
CREATE POLICY "Users can view their own saved items" ON saved_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved items" ON saved_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved items" ON saved_items
  FOR DELETE USING (auth.uid() = user_id);

-- Video calls table policies
CREATE POLICY "Users can view their own video calls" ON video_calls
  FOR SELECT USING (auth.uid() = initiator_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert video calls they initiate" ON video_calls
  FOR INSERT WITH CHECK (auth.uid() = initiator_id);

-- Notifications table policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- User settings table policies
CREATE POLICY "Users can view their own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);
```

---

## 🔄 Create Functions and Triggers

### 1. **Update Timestamp Function**
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';
```

### 2. **Apply Update Triggers**
```sql
-- Apply update triggers to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rental_requests_updated_at BEFORE UPDATE ON rental_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. **Update Item Rating Function**
```sql
-- Function to update item rating when reviews are added/updated
CREATE OR REPLACE FUNCTION update_item_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE items 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM reviews 
      WHERE item_id = COALESCE(NEW.item_id, OLD.item_id) 
      AND review_type = 'item'
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE item_id = COALESCE(NEW.item_id, OLD.item_id) 
      AND review_type = 'item'
    )
  WHERE id = COALESCE(NEW.item_id, OLD.item_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Apply trigger to reviews table
CREATE TRIGGER update_item_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_item_rating();
```

### 4. **Update Conversation Last Message Function**
```sql
-- Function to update conversation last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations 
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to messages table
CREATE TRIGGER update_conversation_last_message_trigger
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();
```

### 5. **Auto-create User Settings Function**
```sql
-- Function to auto-create user settings when user is created
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users table
CREATE TRIGGER create_user_settings_trigger
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION create_user_settings();
```

---

## 📊 Create Views for Analytics

### 1. **Lender Analytics View**
```sql
-- View for lender analytics
CREATE VIEW lender_analytics AS
SELECT 
  u.id as lender_id,
  u.first_name,
  u.last_name,
  COUNT(DISTINCT i.id) as total_items,
  COUNT(DISTINCT CASE WHEN i.is_available THEN i.id END) as active_items,
  COALESCE(SUM(t.amount), 0) as total_earnings,
  COALESCE(SUM(CASE WHEN t.created_at >= date_trunc('month', NOW()) THEN t.amount ELSE 0 END), 0) as monthly_earnings,
  COUNT(DISTINCT t.id) as total_transactions,
  COALESCE(AVG(i.rating), 0) as average_rating,
  COUNT(DISTINCT r.id) as total_reviews
FROM users u
LEFT JOIN items i ON u.id = i.lender_id
LEFT JOIN transactions t ON i.id = t.item_id AND t.status = 'completed'
LEFT JOIN reviews r ON i.id = r.item_id
WHERE u.user_type IN ('lender', 'both')
GROUP BY u.id, u.first_name, u.last_name;
```

### 2. **Item Performance View**
```sql
-- View for item performance metrics
CREATE VIEW item_performance AS
SELECT 
  i.id,
  i.name,
  i.category,
  i.price_per_day,
  i.rating,
  i.total_reviews,
  i.views,
  i.total_rentals,
  COALESCE(SUM(t.amount), 0) as total_revenue,
  COALESCE(AVG(t.amount), 0) as average_transaction_value,
  COUNT(DISTINCT t.id) as transaction_count,
  COUNT(DISTINCT c.id) as conversation_count
FROM items i
LEFT JOIN transactions t ON i.id = t.item_id AND t.status = 'completed'
LEFT JOIN conversations c ON i.id = c.item_id
GROUP BY i.id, i.name, i.category, i.price_per_day, i.rating, i.total_reviews, i.views, i.total_rentals;
```

---

## 🎯 Sample Data (Optional)

```sql
-- Insert sample categories (already included above)
-- Insert sample users (you can add test users here)
-- Insert sample items (you can add test items here)
```

---

## 🚀 Setup Instructions

1. **Copy the entire SQL script above**
2. **Open your Supabase project dashboard**
3. **Go to SQL Editor**
4. **Paste and execute the complete script**
5. **Verify all tables are created successfully**
6. **Test the RLS policies with your authentication**

---

## ✅ Verification Checklist

- [ ] All tables created successfully
- [ ] All indexes created for performance
- [ ] RLS policies applied correctly
- [ ] Triggers and functions working
- [ ] Views created for analytics
- [ ] Sample data inserted (if applicable)
- [ ] Authentication working with new schema

---

## 🔧 Additional Configuration

### Environment Variables
Make sure your app has these environment variables set:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Storage Buckets
Create these storage buckets in Supabase:
- `item-images` - For item photos
- `user-avatars` - For user profile pictures
- `id-documents` - For ID verification images

This comprehensive setup covers all the features and data structures used in your Hirayo rental app! 🎉
