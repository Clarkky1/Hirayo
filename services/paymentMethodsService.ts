import { supabase } from '../lib/supabase';

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'credit_card' | 'debit_card' | 'digital_wallet';
  provider: string; // Visa, Mastercard, GCash, PayMaya, etc.
  last4: string;
  expiry_month?: number;
  expiry_year?: number;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // For digital wallets
  balance?: number;
  wallet_id?: string;
}

export interface AddPaymentMethodData {
  type: 'credit_card' | 'debit_card' | 'digital_wallet';
  provider: string;
  last4: string;
  expiry_month?: number;
  expiry_year?: number;
  is_default?: boolean;
  balance?: number;
  wallet_id?: string;
}

export const paymentMethodsService = {
  // Get all payment methods for a user
  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }

    return data || [];
  },

  // Add a new payment method
  async addPaymentMethod(userId: string, paymentData: AddPaymentMethodData): Promise<PaymentMethod> {
    // If this is being set as default, unset other defaults first
    if (paymentData.is_default) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId)
        .eq('is_default', true);
    }

    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: userId,
        ...paymentData,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }

    return data;
  },

  // Update a payment method
  async updatePaymentMethod(paymentId: string, updates: Partial<AddPaymentMethodData>): Promise<PaymentMethod> {
    // If this is being set as default, unset other defaults first
    if (updates.is_default) {
      const { data: paymentMethod } = await supabase
        .from('payment_methods')
        .select('user_id')
        .eq('id', paymentId)
        .single();

      if (paymentMethod) {
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', paymentMethod.user_id)
          .eq('is_default', true)
          .neq('id', paymentId);
      }
    }

    const { data, error } = await supabase
      .from('payment_methods')
      .update(updates)
      .eq('id', paymentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }

    return data;
  },

  // Delete a payment method (soft delete)
  async deletePaymentMethod(paymentId: string): Promise<void> {
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_active: false })
      .eq('id', paymentId);

    if (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  },

  // Set a payment method as default
  async setDefaultPaymentMethod(userId: string, paymentId: string): Promise<void> {
    // First, unset all other defaults
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', userId)
      .eq('is_default', true);

    // Then set the selected one as default
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', paymentId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  },

  // Get default payment method
  async getDefaultPaymentMethod(userId: string): Promise<PaymentMethod | null> {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching default payment method:', error);
      throw error;
    }

    return data || null;
  },

  // Get payment method by ID
  async getPaymentMethodById(paymentId: string): Promise<PaymentMethod | null> {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('id', paymentId)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching payment method:', error);
      throw error;
    }

    return data || null;
  }
};
