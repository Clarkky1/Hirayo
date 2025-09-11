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

  // Upload item image
  async uploadItemImage(imageUri: string): Promise<string> {
    try {
      // For now, return the original URI as a placeholder
      // In production, you would upload to Supabase Storage
      console.log('Image upload placeholder:', imageUri);
      return imageUri;
      
      // TODO: Implement actual Supabase Storage upload
      // const response = await fetch(imageUri);
      // const blob = await response.blob();
      
      // const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
      // const filePath = `item-images/${fileName}`;
      
      // const { data, error } = await supabase.storage
      //   .from('item-images')
      //   .upload(filePath, blob, {
      //     contentType: 'image/jpeg',
      //     upsert: false
      //   });
      
      // if (error) {
      //   throw error;
      // }
      
      // // Get public URL
      // const { data: { publicUrl } } = supabase.storage
      //   .from('item-images')
      //   .getPublicUrl(filePath);
      
      // return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
};
