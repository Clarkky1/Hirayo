
import { Item, supabase } from '../lib/supabase';

// Ensure we have a properly configured Supabase client
const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }
  return supabase;
};

export const itemsService = {
  // Test storage connection
  async testStorageConnection() {
    try {
      console.log('Testing storage connection...');
      const client = getSupabaseClient();
      console.log('Supabase client initialized:', !!client);
      
      // Check authentication status
      const { data: { user }, error: authError } = await client.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
      } else {
        console.log('Current user:', user ? `${user.email} (${user.id})` : 'Not authenticated');
      }
      
      // Try to list buckets first
      console.log('Attempting to list storage buckets...');
      const { data: buckets, error: bucketsError } = await client.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
        console.error('Buckets error details:', JSON.stringify(bucketsError, null, 2));
        console.error('Error message:', bucketsError.message);
        console.error('Error status:', bucketsError.statusCode);
        
        // If listing buckets fails, try to directly access the item-images bucket
        console.log('Bucket listing failed, trying direct access to item-images bucket...');
        try {
          const { data: files, error: filesError } = await client.storage
            .from('item-images')
            .list('', { limit: 1 });
          
          if (filesError) {
            console.error('Direct bucket access failed:', filesError);
            return { success: false, error: `Cannot access storage: ${filesError.message}` };
          } else {
            console.log('Direct bucket access successful, item-images bucket is accessible');
            return { success: true, bucket: 'item-images' };
          }
        } catch (directError) {
          console.error('Direct bucket access error:', directError);
          return { success: false, error: `Cannot access storage: ${directError}` };
        }
      }
      
      console.log('Available buckets:', buckets?.map(b => b.name));
      console.log('Total buckets found:', buckets?.length || 0);
      
      // Check if item-images bucket exists
      const itemImagesBucket = buckets?.find(b => b.name === 'item-images');
      if (itemImagesBucket) {
        console.log('item-images bucket found:', itemImagesBucket);
        console.log('Bucket details:', {
          name: itemImagesBucket.name,
          id: itemImagesBucket.id,
          public: itemImagesBucket.public,
          created_at: itemImagesBucket.created_at,
          updated_at: itemImagesBucket.updated_at
        });
        return { success: true, bucket: 'item-images' };
      } else {
        console.log('item-images bucket not found, checking other buckets...');
        console.log('All available buckets:', buckets);
        
        // Try to find any available bucket
        if (buckets && buckets.length > 0) {
          const firstBucket = buckets[0];
          console.log('Using first available bucket:', firstBucket.name);
          return { success: true, bucket: firstBucket.name };
        } else {
          return { success: false, error: 'No storage buckets found' };
        }
      }
    } catch (error) {
      console.error('Storage connection test failed:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return { success: false, error };
    }
  },

  // Test upload functionality
  async testUpload() {
    try {
      console.log('Testing upload functionality...');
      const client = getSupabaseClient();
      
      // Create a simple test blob
      const testData = new Blob(['test content'], { type: 'text/plain' });
      const testFileName = `test-${Date.now()}.txt`;
      
      console.log('Attempting test upload to item-images bucket...');
      console.log('Test file name:', testFileName);
      
      const { data, error } = await client.storage
        .from('item-images')
        .upload(`test/${testFileName}`, testData, {
          contentType: 'text/plain',
          upsert: false
        });
      
      if (error) {
        console.error('Test upload error:', error);
        console.error('Upload error details:', JSON.stringify(error, null, 2));
        console.error('Error message:', error.message);
        console.error('Error status:', error.statusCode);
        return { success: false, error };
      }
      
      console.log('Test upload successful:', data);
      
      // Clean up test file
      try {
        await client.storage
          .from('item-images')
          .remove([`test/${testFileName}`]);
        console.log('Test file cleaned up successfully');
      } catch (cleanupError) {
        console.warn('Failed to clean up test file:', cleanupError);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Test upload failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },
  // Get all available items
  async getItems(filters?: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) {
    let query = supabase
      .from('items')
      .select(`
        *,
        lender:users!lender_id(
          id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters?.minPrice) {
      query = query.gte('price_per_day', filters.minPrice);
    }

    if (filters?.maxPrice) {
      query = query.lte('price_per_day', filters.maxPrice);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Get item by ID
  async getItemById(id: string) {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        lender:users!lender_id(
          id,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Get items by lender
  async getItemsByLender(lenderId: string) {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('lender_id', lenderId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Create new item
  async createItem(item: Omit<Item, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('items')
      .insert(item)
      .select()
      .single();

    return { data, error };
  },

  // Update item
  async updateItem(id: string, updates: Partial<Item>) {
    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Delete item
  async deleteItem(id: string) {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);

    return { error };
  },

  // Upload item image to Supabase Storage
  async uploadItemImage(imageUri: string, userId?: string): Promise<string> {
    try {
      console.log('Starting image upload for user:', userId);
      console.log('Image URI:', imageUri);
      const client = getSupabaseClient();
      
      // Convert image URI to blob
      const response = await fetch(imageUri);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();
      console.log('Image blob size:', blob.size, 'bytes');
      
      // Generate unique filename
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
      const filePath = userId ? `${userId}/${fileName}` : fileName;
      console.log('Upload path:', filePath);
      
      // Upload directly to item-images bucket
      const bucketName = 'item-images';
      console.log('Attempting upload to bucket:', bucketName);
      console.log('File path:', filePath);
      console.log('Blob size:', blob.size, 'bytes');
      
      const { data, error } = await client.storage
        .from(bucketName)
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: false
        });
      
      if (error) {
        console.error('Upload error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Error message:', error.message);
        console.error('Error status:', (error as any).statusCode);
        
        // Provide more specific error information
        if (error.message?.includes('permission denied') || error.message?.includes('unauthorized')) {
          throw new Error('Permission denied. Please check your authentication and RLS policies.');
        } else if (error.message?.includes('not found') || error.message?.includes('does not exist')) {
          throw new Error('Storage bucket not found. Please check your Supabase storage configuration.');
        } else if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
          // Try with a different filename
          const newFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${Math.random().toString(36).substring(2)}.jpg`;
          const newFilePath = userId ? `${userId}/${newFileName}` : newFileName;
          console.log('Trying with new filename:', newFilePath);
          
          const retryResult = await client.storage
            .from(bucketName)
            .upload(newFilePath, blob, {
              contentType: 'image/jpeg',
              upsert: false
            });
          
          if (retryResult.error) {
            throw retryResult.error;
          }
          
          const { data: { publicUrl } } = client.storage
            .from(bucketName)
            .getPublicUrl(newFilePath);
          
          console.log('Successfully uploaded with new filename:', publicUrl);
          return publicUrl;
        } else {
          throw error;
        }
      }
      
      console.log('Successfully uploaded to item-images bucket');
      
      // Get public URL
      const { data: { publicUrl } } = client.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      console.log('Public URL:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  },

  // Upload user avatar to Supabase Storage
  async uploadUserAvatar(imageUri: string, userId: string): Promise<string> {
    try {
      // Convert image URI to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Generate unique filename
      const fileName = `avatar-${Date.now()}.jpg`;
      const filePath = `avatars/${userId}/${fileName}`;
      
      // Try to upload to user-avatars bucket first, fallback to public bucket
      let bucketName = 'user-avatars';
      let { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true // Allow overwriting existing avatar
        });
      
      // If user-avatars bucket doesn't exist, try public bucket
      if (error && error.message?.includes('not found')) {
        console.log('user-avatars bucket not found, trying public bucket...');
        bucketName = 'public';
        const publicFilePath = `user-avatars/${filePath}`;
        const result = await supabase.storage
          .from(bucketName)
          .upload(publicFilePath, blob, {
            contentType: 'image/jpeg',
            upsert: true
          });
        data = result.data;
        error = result.error;
        // filePath = publicFilePath; // This line was causing the error, removed
      }
      
      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  },

  // Upload ID document to Supabase Storage
  async uploadIdDocument(imageUri: string, userId: string, idType: string): Promise<string> {
    try {
      // Convert image URI to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Generate filename based on ID type
      const fileName = `${idType}-${Date.now()}.jpg`;
      const filePath = `${userId}/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('id-documents')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true // Allow overwriting existing ID document
        });
      
      if (error) {
        throw error;
      }
      
      // Get public URL (this will be private due to RLS policies)
      const { data: { publicUrl } } = supabase.storage
        .from('id-documents')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading ID document:', error);
      throw error;
    }
  },
};
