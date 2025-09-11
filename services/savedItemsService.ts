import { supabase } from '../lib/supabase';

export const savedItemsService = {
  // Get saved items for a user
  async getSavedItems(userId: string) {
    const { data, error } = await supabase
      .from('saved_items')
      .select(`
        *,
        item:items(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Save an item
  async saveItem(userId: string, itemId: string) {
    const { data, error } = await supabase
      .from('saved_items')
      .insert({
        user_id: userId,
        item_id: itemId,
      })
      .select(`
        *,
        item:items(*)
      `)
      .single();

    return { data, error };
  },

  // Remove saved item
  async removeSavedItem(userId: string, itemId: string) {
    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('user_id', userId)
      .eq('item_id', itemId);

    return { error };
  },

  // Check if item is saved
  async isItemSaved(userId: string, itemId: string) {
    const { data, error } = await supabase
      .from('saved_items')
      .select('id')
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .single();

    return { data: !!data, error };
  },

  // Toggle saved item (save if not saved, remove if saved)
  async toggleSavedItem(userId: string, itemId: string) {
    const { data: isSaved } = await this.isItemSaved(userId, itemId);
    
    if (isSaved) {
      return await this.removeSavedItem(userId, itemId);
    } else {
      return await this.saveItem(userId, itemId);
    }
  },
};
