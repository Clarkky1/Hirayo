import { supabase } from '../lib/supabase';

export interface LenderItem {
  id: string;
  name: string;
  description: string;
  price_per_day: number;
  category: string;
  location: string;
  images: string[];
  is_available: boolean;
  rating: number;
  total_rentals: number;
  created_at: string;
  updated_at: string;
  lender_id: string;
}

export interface LenderEarnings {
  total_earnings: number;
  this_month: number;
  active_rentals: number;
  pending_amount: number;
  earnings_by_category: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  recent_transactions: {
    id: string;
    item_name: string;
    amount: number;
    status: 'completed' | 'pending' | 'cancelled';
    created_at: string;
  }[];
}

export interface LenderAnalytics {
  total_views: number;
  average_rating: number;
  repeat_customers: number;
  top_performing_items: {
    id: string;
    name: string;
    rentals: number;
    rating: number;
    views: number;
  }[];
  customer_insights: {
    most_active_time: string;
    top_location: string;
    peak_season: string;
  };
}

export interface LenderActivity {
  id: string;
  type: 'rental_request' | 'payment_received' | 'review_received' | 'item_rented';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  item_name?: string;
  renter_name?: string;
}

export const lenderService = {
  // Get lender's items
  async getLenderItems(lenderId: string): Promise<LenderItem[]> {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('lender_id', lenderId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },

  // Get lender's earnings data
  async getLenderEarnings(lenderId: string, period: 'week' | 'month' | 'year' = 'month'): Promise<LenderEarnings> {
    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    // Get transactions for the period
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select(`
        *,
        item:items(*)
      `)
      .eq('lender_id', lenderId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (transactionsError) {
      throw transactionsError;
    }

    // Calculate earnings
    const totalEarnings = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
    const thisMonth = transactions?.filter(t => {
      const transactionDate = new Date(t.created_at);
      return transactionDate.getMonth() === now.getMonth() && 
             transactionDate.getFullYear() === now.getFullYear();
    }).reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

    const activeRentals = transactions?.filter(t => t.status === 'active').reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
    const pendingAmount = transactions?.filter(t => t.status === 'pending').reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

    // Calculate earnings by category
    const categoryEarnings: { [key: string]: number } = {};
    transactions?.forEach(t => {
      const category = t.item?.category || 'Other';
      categoryEarnings[category] = (categoryEarnings[category] || 0) + (t.amount || 0);
    });

    const earningsByCategory = Object.entries(categoryEarnings).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalEarnings > 0 ? (amount / totalEarnings) * 100 : 0
    }));

    const recentTransactions = transactions?.slice(0, 10).map(t => ({
      id: t.id,
      item_name: t.item?.name || 'Unknown Item',
      amount: t.amount || 0,
      status: t.status as 'completed' | 'pending' | 'cancelled',
      created_at: t.created_at
    })) || [];

    return {
      total_earnings: totalEarnings,
      this_month: thisMonth,
      active_rentals: activeRentals,
      pending_amount: pendingAmount,
      earnings_by_category: earningsByCategory,
      recent_transactions: recentTransactions
    };
  },

  // Get lender's analytics data
  async getLenderAnalytics(lenderId: string, period: 'week' | 'month' | 'year' = 'month'): Promise<LenderAnalytics> {
    // Get items with their performance data
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select(`
        *,
        transactions(*),
        reviews(*)
      `)
      .eq('lender_id', lenderId);

    if (itemsError) {
      throw itemsError;
    }

    // Calculate analytics
    const totalViews = items?.reduce((sum, item) => sum + (item.views || 0), 0) || 0;
    const allRatings = items?.flatMap(item => item.reviews?.map((r: any) => r.rating) || []) || [];
    const averageRating = allRatings.length > 0 ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length : 0;
    
    // Count repeat customers (simplified - customers with multiple transactions)
    const allTransactions = items?.flatMap(item => item.transactions || []) || [];
    const customerTransactionCounts: { [key: string]: number } = {};
    allTransactions.forEach(t => {
      if (t.renter_id) {
        customerTransactionCounts[t.renter_id] = (customerTransactionCounts[t.renter_id] || 0) + 1;
      }
    });
    const repeatCustomers = Object.values(customerTransactionCounts).filter(count => count > 1).length;

    // Top performing items
    const topPerformingItems = items?.map(item => ({
      id: item.id,
      name: item.name,
      rentals: item.transactions?.length || 0,
      rating: item.reviews?.length > 0 ? 
        item.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / item.reviews.length : 0,
      views: item.views || 0
    })).sort((a, b) => b.rentals - a.rentals).slice(0, 5) || [];

    // Customer insights (simplified mock data for now)
    const customerInsights = {
      most_active_time: 'Weekends (Fri-Sun)',
      top_location: 'Cebu City (45%)',
      peak_season: 'December - March'
    };

    return {
      total_views: totalViews,
      average_rating: averageRating,
      repeat_customers: repeatCustomers,
      top_performing_items: topPerformingItems,
      customer_insights: customerInsights
    };
  },

  // Get lender's recent activity
  async getLenderActivity(lenderId: string): Promise<LenderActivity[]> {
    // Get recent transactions, messages, and reviews
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select(`
        *,
        item:items(*),
        renter:users!transactions_renter_id_fkey(*)
      `)
      .eq('lender_id', lenderId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (transactionsError) {
      throw transactionsError;
    }

    // Transform transactions into activities
    const activities: LenderActivity[] = transactions?.map(t => {
      const itemName = t.item?.name || 'Unknown Item';
      const renterName = t.renter ? `${t.renter.first_name} ${t.renter.last_name}` : 'Unknown Renter';
      
      switch (t.status) {
        case 'completed':
          return {
            id: `payment-${t.id}`,
            type: 'payment_received',
            title: 'Payment Received',
            description: `₱${t.amount} from ${itemName} rental`,
            timestamp: t.created_at,
            amount: t.amount,
            item_name: itemName,
            renter_name: renterName
          };
        case 'pending':
          return {
            id: `request-${t.id}`,
            type: 'rental_request',
            title: 'New Rental Request',
            description: `${renterName} wants to rent ${itemName}`,
            timestamp: t.created_at,
            item_name: itemName,
            renter_name: renterName
          };
        default:
          return {
            id: `activity-${t.id}`,
            type: 'item_rented',
            title: 'Item Rented',
            description: `${itemName} was rented`,
            timestamp: t.created_at,
            item_name: itemName
          };
      }
    }) || [];

    return activities;
  },

  // Get lender's dashboard overview
  async getLenderOverview(lenderId: string) {
    const [items, earnings, activity] = await Promise.all([
      this.getLenderItems(lenderId),
      this.getLenderEarnings(lenderId),
      this.getLenderActivity(lenderId)
    ]);

    const activeItems = items.filter(item => item.is_available).length;
    const totalRentals = items.reduce((sum, item) => sum + item.total_rentals, 0);

    return {
      total_items: items.length,
      active_items: activeItems,
      total_earnings: earnings.total_earnings,
      this_month_earnings: earnings.this_month,
      total_rentals: totalRentals,
      recent_activity: activity.slice(0, 5)
    };
  }
};
