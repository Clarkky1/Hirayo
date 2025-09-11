# 🚀 Supabase Setup Guide for Hirayo Rental App

## ✅ What's Been Done

Your app has been successfully integrated with Supabase! Here's what's been implemented:

### 🔧 **Files Created/Updated:**

1. **`lib/supabase.ts`** - Supabase client configuration
2. **`contexts/SupabaseAuthContext.tsx`** - Authentication context
3. **`services/itemsService.ts`** - Items management
4. **`services/messagesService.ts`** - Real-time messaging
5. **`services/transactionsService.ts`** - Transaction management
6. **`services/savedItemsService.ts`** - Saved items management
7. **`database/schema.sql`** - Complete database schema
8. **Updated screens** - Login, Signup, Discover, Transactions, Saved Items

### 🗄️ **Database Schema:**
- **Users** - Authentication & profiles
- **Items** - Rental items with images
- **Conversations** - Chat threads
- **Messages** - Real-time chat
- **Transactions** - Rental payments
- **Saved Items** - User favorites

## 🚀 **Next Steps - Complete Setup:**

### 1. **Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up/Login with GitHub
4. Click "New Project"
5. Choose organization and enter project details:
   - **Name:** `hirayo-rental-app`
   - **Database Password:** Generate a strong password
   - **Region:** Choose closest to your users

### 2. **Get API Keys**
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### 3. **Set Environment Variables**
Create a `.env` file in your project root:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. **Set Up Database**
1. In Supabase dashboard, go to **SQL Editor**
2. Copy the entire content from `database/schema.sql`
3. Paste it into the SQL editor
4. Click **Run** to create all tables and policies

### 5. **Enable Storage**
1. Go to **Storage** in your Supabase dashboard
2. Click **Create Bucket**
3. Name: `item-images`
4. Set to **Public**
5. Click **Create Bucket**

### 6. **Configure Authentication**
1. Go to **Authentication** → **Settings**
2. **Site URL:** `exp://192.168.1.100:8081` (or your Expo URL)
3. **Redirect URLs:** Add your app's URL
4. **Phone Auth:** Enable and configure with your SMS provider

### 7. **Test Your App**
```bash
npm start
```

## 🔐 **Security Features Implemented:**

- ✅ Row Level Security (RLS) policies
- ✅ User can only access their own data
- ✅ Public item listings
- ✅ Secure file uploads
- ✅ Phone number authentication
- ✅ OTP verification

## 📱 **Features Now Dynamic:**

- ✅ **Authentication** - Real Supabase auth
- ✅ **Items Discovery** - Live data from database
- ✅ **Transactions** - Real transaction history
- ✅ **Saved Items** - Persistent favorites
- ✅ **Real-time Chat** - Live messaging (ready for implementation)

## 🛠️ **Development Tips:**

### **Adding New Items:**
```typescript
const { data, error } = await itemsService.createItem({
  lender_id: user.id,
  name: 'MacBook Pro',
  description: 'Great laptop for work',
  price_per_day: 2500,
  category: 'laptop',
  location: 'Cebu City',
  images: ['image_url_1', 'image_url_2']
});
```

### **Real-time Updates:**
```typescript
// Subscribe to new messages
const subscription = messagesService.subscribeToMessages(
  conversationId, 
  (message) => {
    // Handle new message
  }
);

// Don't forget to unsubscribe
messagesService.unsubscribeFromMessages(subscription);
```

## 🚨 **Important Notes:**

1. **Phone Authentication:** You'll need to configure SMS provider in Supabase
2. **File Uploads:** Images are stored in Supabase Storage
3. **Real-time:** WebSocket connections for live chat
4. **Security:** All data is protected by RLS policies

## 🎉 **You're Ready!**

Your app is now fully dynamic with Supabase! Users can:
- Sign up with phone numbers
- Browse real items from the database
- Save favorites that persist
- View their transaction history
- Chat in real-time (when implemented)

Need help with any specific feature? Just ask! 🚀
