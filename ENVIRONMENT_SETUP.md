# Environment Variables Setup

## Supabase Configuration

To use environment variables for Supabase configuration, create a `.env.local` file in the root directory with the following content:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://ovelzhyqfxvruoysolez.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92ZWx6aHlxZnh2cnVveXNvbGV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzY2MzUsImV4cCI6MjA3MTE1MjYzNX0.3ku4ZparEBzshGw1C2ALvBawMemoDHqDe0Wd9CSKW_k
```

## How to Set Up

1. Create a `.env.local` file in the root directory
2. Copy the content above into the file
3. The app will automatically use these environment variables
4. If the environment variables are not found, it will fall back to the hardcoded values

## Current Configuration

The Supabase configuration is currently set up in `lib/supabase.ts` with:
- **URL**: `https://ovelzhyqfxvruoysolez.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92ZWx6aHlxZnh2cnVveXNvbGV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzY2MzUsImV4cCI6MjA3MTE1MjYzNX0.3ku4ZparEBzshGw1C2ALvBawMemoDHqDe0Wd9CSKW_k`

The app is already configured to use your Supabase anon key and will work with the current setup.
