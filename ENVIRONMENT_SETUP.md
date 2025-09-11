# Environment Setup

## Supabase Configuration

Your Supabase configuration has been updated with the new URL and anon key:

### New Supabase URL
```
https://tjpfwivbyzaxnlvbxrqc.supabase.co
```

### New Anon Key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqcGZ3aXZieXpheG5sdmJ4cnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MDA1MDUsImV4cCI6MjA3MzE3NjUwNX0.OrSgdnT_mjcZPR2K2UF5vrXYxKJ62DV-xZ4MR8wF2Vo
```

## Environment Variables

Create a `.env` file in your project root with the following content:

```env
EXPO_PUBLIC_SUPABASE_URL=https://tjpfwivbyzaxnlvbxrqc.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqcGZ3aXZieXpheG5sdmJ4cnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MDA1MDUsImV4cCI6MjA3MzE3NjUwNX0.OrSgdnT_mjcZPR2K2UF5vrXYxKJ62DV-xZ4MR8wF2Vo
```

## Next Steps

1. **Create the .env file** with the content above
2. **Run the SQL setup** using `SUPABASE_FIXED_SETUP.sql` in your new Supabase project
3. **Create storage buckets** as described in the Supabase setup documentation
4. **Test the connection** by running your app

## Storage Buckets Required

Make sure to create these storage buckets in your Supabase dashboard:

1. **item-images** (public)
2. **user-avatars** (public) 
3. **id-documents** (private)

The RLS policies for these buckets are included in the SQL setup file.