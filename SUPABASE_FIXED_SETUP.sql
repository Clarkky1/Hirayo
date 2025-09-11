-- 🗄️ Hirayo Rental App - Fixed Supabase SQL Setup
-- This script fixes the "reviews table does not exist" error

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
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

-- 2. Create Items Table
CREATE TABLE IF NOT EXISTS items (
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

-- 3. Create Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
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

-- 4. Create Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  message_text TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'image', 'file', 'system')) DEFAULT 'text',
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Rental Requests Table
CREATE TABLE IF NOT EXISTS rental_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  renter_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  lender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
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

-- 6. Create Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
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

-- 7. Create Reviews Table (FIXED - Now references existing transactions table)
CREATE TABLE IF NOT EXISTS reviews (
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

-- 8. Create Payment Methods Table
CREATE TABLE IF NOT EXISTS payment_methods (
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

-- 9. Create Saved Items Table
CREATE TABLE IF NOT EXISTS saved_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- 10. Create Video Calls Table
CREATE TABLE IF NOT EXISTS video_calls (
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

-- 11. Create Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
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

-- 12. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES categories(id),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Create User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
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

-- Insert tech-focused categories
INSERT INTO categories (name, description, icon) VALUES
('Camera', 'Cameras, lenses, and photography equipment', 'camera-outline'),
('Laptop', 'Laptops, notebooks, and portable computers', 'laptop-outline'),
('Phone', 'Smartphones and mobile devices', 'phone-portrait-outline'),
('Tablet/iPad', 'Tablets, iPads, and touchscreen devices', 'tablet-portrait-outline'),
('Drone', 'Drones, quadcopters, and aerial devices', 'airplane-outline'),
('PC', 'Desktop computers and workstations', 'desktop-outline'),
('Gaming', 'Gaming consoles, accessories, and equipment', 'game-controller-outline'),
('Audio', 'Audio equipment, headphones, and speakers', 'headset-outline')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_items_lender_id ON items(lender_id);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_location ON items(location);
CREATE INDEX IF NOT EXISTS idx_items_rating ON items(rating);
CREATE INDEX IF NOT EXISTS idx_items_is_available ON items(is_available);
CREATE INDEX IF NOT EXISTS idx_conversations_item_id ON conversations(item_id);
CREATE INDEX IF NOT EXISTS idx_conversations_renter_id ON conversations(renter_id);
CREATE INDEX IF NOT EXISTS idx_conversations_lender_id ON conversations(lender_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_rental_requests_item_id ON rental_requests(item_id);
CREATE INDEX IF NOT EXISTS idx_rental_requests_renter_id ON rental_requests(renter_id);
CREATE INDEX IF NOT EXISTS idx_rental_requests_lender_id ON rental_requests(lender_id);
CREATE INDEX IF NOT EXISTS idx_rental_requests_status ON rental_requests(status);
CREATE INDEX IF NOT EXISTS idx_transactions_item_id ON transactions(item_id);
CREATE INDEX IF NOT EXISTS idx_transactions_renter_id ON transactions(renter_id);
CREATE INDEX IF NOT EXISTS idx_transactions_lender_id ON transactions(lender_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_reviews_item_id ON reviews(item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_transaction_id ON reviews(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_items_user_id ON saved_items(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_items_item_id ON saved_items(item_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
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

CREATE POLICY "Users can view their own items" ON items
  FOR SELECT USING (auth.uid() = lender_id);

CREATE POLICY "Users can insert their own items" ON items
  FOR INSERT WITH CHECK (auth.uid() = lender_id);

CREATE POLICY "Users can update their own items" ON items
  FOR UPDATE USING (auth.uid() = lender_id);

CREATE POLICY "Users can delete their own items" ON items
  FOR DELETE USING (auth.uid() = lender_id);

-- Conversations table policies
CREATE POLICY "Users can view conversations they are part of" ON conversations
  FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = lender_id);

CREATE POLICY "Users can insert conversations they are part of" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = renter_id OR auth.uid() = lender_id);

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
CREATE POLICY "Users can view rental requests for their items" ON rental_requests
  FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = lender_id);

CREATE POLICY "Users can insert rental requests" ON rental_requests
  FOR INSERT WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Lenders can update rental requests for their items" ON rental_requests
  FOR UPDATE USING (auth.uid() = lender_id);

-- Transactions table policies
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = lender_id);

CREATE POLICY "Users can insert transactions they are part of" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = renter_id OR auth.uid() = lender_id);

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

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);

-- Payment methods table policies
CREATE POLICY "Users can view their own payment methods" ON payment_methods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods" ON payment_methods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods" ON payment_methods
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods" ON payment_methods
  FOR DELETE USING (auth.uid() = user_id);

-- Saved items table policies
CREATE POLICY "Users can view their own saved items" ON saved_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved items" ON saved_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved items" ON saved_items
  FOR DELETE USING (auth.uid() = user_id);

-- Notifications table policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Categories table policies
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- User settings table policies
CREATE POLICY "Users can view their own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Create functions for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating timestamps
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

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update item ratings
CREATE OR REPLACE FUNCTION update_item_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE items 
    SET 
        rating = (
            SELECT AVG(rating)::DECIMAL(3,2) 
            FROM reviews 
            WHERE item_id = NEW.item_id AND review_type = 'item'
        ),
        total_reviews = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE item_id = NEW.item_id AND review_type = 'item'
        )
    WHERE id = NEW.item_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update item ratings when reviews change
CREATE TRIGGER update_item_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_item_rating();

-- Create views for analytics
CREATE OR REPLACE VIEW lender_analytics AS
SELECT 
    u.id as lender_id,
    u.first_name,
    u.last_name,
    COUNT(DISTINCT i.id) as total_items,
    COUNT(DISTINCT CASE WHEN i.is_available THEN i.id END) as active_items,
    COALESCE(SUM(t.lender_earnings), 0) as total_earnings,
    COALESCE(SUM(CASE WHEN t.created_at >= DATE_TRUNC('month', NOW()) THEN t.lender_earnings ELSE 0 END), 0) as this_month_earnings,
    COUNT(DISTINCT t.id) as total_rentals,
    COALESCE(AVG(i.rating), 0) as average_rating
FROM users u
LEFT JOIN items i ON u.id = i.lender_id
LEFT JOIN transactions t ON i.id = t.item_id AND t.status = 'completed'
WHERE u.user_type IN ('lender', 'both')
GROUP BY u.id, u.first_name, u.last_name;

-- Create view for item performance
CREATE OR REPLACE VIEW item_performance AS
SELECT 
    i.id,
    i.name,
    i.category,
    i.price_per_day,
    i.rating,
    i.total_reviews,
    i.views,
    i.total_rentals,
    COALESCE(SUM(t.lender_earnings), 0) as total_earnings,
    COALESCE(AVG(t.lender_earnings), 0) as avg_earnings_per_rental
FROM items i
LEFT JOIN transactions t ON i.id = t.item_id AND t.status = 'completed'
GROUP BY i.id, i.name, i.category, i.price_per_day, i.rating, i.total_reviews, i.views, i.total_rentals;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'Hirayo database setup completed successfully! All tables, indexes, policies, and functions have been created.' as status;
