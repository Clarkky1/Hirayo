import { supabase, Transaction } from '../lib/supabase';

export const transactionsService = {
  // Get transactions for a user
  async getTransactions(userId: string, filters?: {
    status?: string;
    type?: 'renter' | 'lender';
  }) {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        item:items(*),
        renter:users!transactions_renter_id_fkey(*),
        lender:users!transactions_lender_id_fkey(*)
      `)
      .or(`renter_id.eq.${userId},lender_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.type === 'renter') {
      query = query.eq('renter_id', userId);
    } else if (filters?.type === 'lender') {
      query = query.eq('lender_id', userId);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Get transaction by ID
  async getTransactionById(id: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        item:items(*),
        renter:users!transactions_renter_id_fkey(*),
        lender:users!transactions_lender_id_fkey(*)
      `)
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Create new transaction
  async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select(`
        *,
        item:items(*),
        renter:users!transactions_renter_id_fkey(*),
        lender:users!transactions_lender_id_fkey(*)
      `)
      .single();

    return { data, error };
  },

  // Update transaction status
  async updateTransactionStatus(id: string, status: 'pending' | 'completed' | 'cancelled' | 'refunded') {
    const { data, error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        item:items(*),
        renter:users!transactions_renter_id_fkey(*),
        lender:users!transactions_lender_id_fkey(*)
      `)
      .single();

    return { data, error };
  },

  // Get transaction statistics
  async getTransactionStats(userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('status, amount')
      .or(`renter_id.eq.${userId},lender_id.eq.${userId}`);

    if (error) return { data: null, error };

    const stats = {
      total: data?.length || 0,
      completed: data?.filter(t => t.status === 'completed').length || 0,
      pending: data?.filter(t => t.status === 'pending').length || 0,
      cancelled: data?.filter(t => t.status === 'cancelled').length || 0,
      totalEarnings: data?.filter(t => t.status === 'completed' && (t as any).lender_id === userId)
        .reduce((sum, t) => sum + (t as any).amount, 0) || 0,
      totalSpent: data?.filter(t => t.status === 'completed' && (t as any).renter_id === userId)
        .reduce((sum, t) => sum + (t as any).amount, 0) || 0,
    };

    return { data: stats, error: null };
  },
};
