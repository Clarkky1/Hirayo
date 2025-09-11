import { Item, supabase } from '../lib/supabase';

export const itemsService = {
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
      .select('*')
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
      .select('*')
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
      // Convert image URI to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Generate unique filename
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
      const filePath = userId ? `${userId}/${fileName}` : fileName;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('item-images')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: false
        });
      
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('item-images')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
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
      const filePath = `${userId}/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true // Allow overwriting existing avatar
        });
      
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
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
