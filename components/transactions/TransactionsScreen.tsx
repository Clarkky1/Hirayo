import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { transactionsService } from '@/services/transactionsService';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { TransactionSkeleton } from '../common/SkeletonLoader';

interface Transaction {
  id: string;
  itemName: string;
  ownerName: string;
  amount: number;
  status: 'completed' | 'active' | 'cancelled' | 'pending' | 'refunded';
  date: string;
  duration: string;
  imageUrl?: string;
}

const TransactionCard: React.FC<{ item: Transaction; onPress: (item: Transaction) => void }> = ({ item, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#00A86B';
      case 'active':
        return '#0066CC';
      case 'cancelled':
        return '#FF6B6B';
      default:
        return '#666666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'active':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <TouchableOpacity style={styles.transactionCard} onPress={() => onPress(item)} activeOpacity={0.7}>
      {/* Item Image Placeholder */}
      <View style={styles.itemImage} />
      
      {/* Transaction Details */}
      <View style={styles.transactionDetails}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.itemName}
        </Text>
        <Text style={styles.ownerName}>
          Owner: {item.ownerName}
        </Text>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={14} color="#666666" />
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.durationText}>({item.duration})</Text>
        </View>
      </View>

      {/* Amount and Status */}
      <View style={styles.amountStatusContainer}>
        <Text style={styles.amount}>
          ₱{item.amount.toLocaleString()} <Text style={styles.perDayText}>for a day</Text>
        </Text>
        <View style={styles.statusContainer}>
          <Ionicons 
            name={getStatusIcon(item.status) as any} 
            size={16} 
            color={getStatusColor(item.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function TransactionsScreen() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'active' | 'cancelled'>('all');
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabaseAuth();
  const params = useLocalSearchParams();
  const navigation = useNavigation();

  // Load transactions from Supabase
  const loadTransactions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await transactionsService.getTransactions(user.id, {
        status: activeFilter === 'all' ? undefined : activeFilter,
      });
      
      if (error) {
        console.error('Error loading transactions:', error);
        setError('Failed to load transactions');
        return;
      }
      
      // Convert Supabase transactions to Transaction format
      const convertedTransactions: Transaction[] = (data || []).map((tx: any) => ({
        id: tx.id,
        itemName: tx.item?.name || 'Unknown Item',
        ownerName: tx.lender?.first_name ? `${tx.lender.first_name} ${tx.lender.last_name}` : 'Unknown Owner',
        amount: tx.amount,
        status: tx.status === 'pending' ? 'active' : tx.status,
        date: `${tx.start_date} - ${tx.end_date}`,
        duration: `${tx.duration_days} days`,
        imageUrl: tx.item?.images?.[0],
      }));
      
      setTransactions(convertedTransactions);
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  // Load transactions when component mounts or filter changes
  useEffect(() => {
    loadTransactions();
  }, [user, activeFilter]);

  // Configure header with filter icon
  useEffect(() => {
    navigation.setOptions({
      title: 'Transactions',
      headerStyle: {
        backgroundColor: '#667EEA',
      },
      headerTintColor: '#ffffff',
      headerRight: () => (
        <TouchableOpacity 
          style={{ marginRight: 16, padding: 4 }} 
          onPress={toggleFiltersDropdown}
          activeOpacity={0.7}
        >
          <Ionicons name="filter" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, showFiltersDropdown]);
  
  // We'll use these params to enhance the receipt when coming from payment
  const showReceipt = params.showReceipt === 'true';
  const paymentAmount = Array.isArray(params.paymentAmount) ? params.paymentAmount[0] : params.paymentAmount;
  const itemName = Array.isArray(params.itemName) ? params.itemName[0] : params.itemName;
  const renterName = Array.isArray(params.renterName) ? params.renterName[0] : params.renterName;
  const lenderName = Array.isArray(params.lenderName) ? params.lenderName[0] : params.lenderName;
  const lenderLocation = Array.isArray(params.lenderLocation) ? params.lenderLocation[0] : params.lenderLocation;
  const startDate = Array.isArray(params.startDate) ? params.startDate[0] : params.startDate;
  const endDate = Array.isArray(params.endDate) ? params.endDate[0] : params.endDate;
  const duration = Array.isArray(params.duration) ? params.duration[0] : params.duration;
  const dailyRate = Array.isArray(params.dailyRate) ? params.dailyRate[0] : params.dailyRate;
  const subtotal = Array.isArray(params.subtotal) ? params.subtotal[0] : params.subtotal;
  const taxAmount = Array.isArray(params.taxAmount) ? params.taxAmount[0] : params.taxAmount;
  const serviceFee = Array.isArray(params.serviceFee) ? params.serviceFee[0] : params.serviceFee;
  const totalAmount = Array.isArray(params.totalAmount) ? params.totalAmount[0] : params.totalAmount;
  const pickupLocation = Array.isArray(params.pickupLocation) ? params.pickupLocation[0] : params.pickupLocation;
  const returnLocation = Array.isArray(params.returnLocation) ? params.returnLocation[0] : params.returnLocation;
  const paymentMethod = Array.isArray(params.paymentMethod) ? params.paymentMethod[0] : params.paymentMethod;
  const transactionId = Array.isArray(params.transactionId) ? params.transactionId[0] : params.transactionId;

  const filteredTransactions = activeFilter === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === activeFilter);

  const handleTransactionPress = (transaction: Transaction) => {
    // Check if this is the enhanced receipt transaction (from payment)
    const isEnhancedReceipt = showReceipt && transaction.itemName === itemName;
    
    if (isEnhancedReceipt) {
      // Navigate to receipt page with all payment details
      router.replace({
        pathname: '/receipt',
        params: {
          showReceipt: 'true',
          paymentAmount,
          itemName,
          renterName,
          lenderName,
          lenderLocation,
          startDate,
          endDate,
          duration,
          dailyRate,
          subtotal,
          taxAmount,
          serviceFee,
          totalAmount,
          pickupLocation,
          returnLocation,
          paymentMethod,
          transactionId
        }
      });
    } else {
      // Navigate to receipt page with basic transaction details
      router.replace({
        pathname: '/receipt',
        params: {
          showReceipt: 'false',
          itemName: transaction.itemName,
          paymentAmount: transaction.amount.toString(),
          transactionId: transaction.id,
          startDate: transaction.date,
          duration: transaction.duration,
          lenderName: transaction.ownerName
        }
      });
    }
  };

  const handleFilterSelect = (filter: 'all' | 'completed' | 'active' | 'cancelled') => {
    setActiveFilter(filter);
    setShowFiltersDropdown(false);
  };

  const toggleFiltersDropdown = () => {
    setShowFiltersDropdown(!showFiltersDropdown);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: '#667EEA', height: 0 }} />

      {/* Filter Dropdown */}
      {showFiltersDropdown && (
        <>
          <TouchableOpacity 
            style={styles.backdrop} 
            onPress={() => setShowFiltersDropdown(false)}
            activeOpacity={1}
          />
          <View style={styles.filtersDropdown}>
            <TouchableOpacity 
              style={[styles.filterOption, activeFilter === 'all' && styles.activeFilterOption]} 
              onPress={() => handleFilterSelect('all')}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterOptionText, activeFilter === 'all' && styles.activeFilterOptionText]}>
                All
              </Text>
               {activeFilter === 'all' && (
                 <Ionicons name="checkmark" size={16} color="#667EEA" />
               )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, activeFilter === 'active' && styles.activeFilterOption]} 
              onPress={() => handleFilterSelect('active')}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterOptionText, activeFilter === 'active' && styles.activeFilterOptionText]}>
                Active
              </Text>
               {activeFilter === 'active' && (
                 <Ionicons name="checkmark" size={16} color="#667EEA" />
               )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, activeFilter === 'completed' && styles.activeFilterOption]} 
              onPress={() => handleFilterSelect('completed')}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterOptionText, activeFilter === 'completed' && styles.activeFilterOptionText]}>
                Completed
              </Text>
               {activeFilter === 'completed' && (
                 <Ionicons name="checkmark" size={16} color="#667EEA" />
               )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterOption, activeFilter === 'cancelled' && styles.activeFilterOption]} 
              onPress={() => handleFilterSelect('cancelled')}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterOptionText, activeFilter === 'cancelled' && styles.activeFilterOptionText]}>
                Cancelled
              </Text>
               {activeFilter === 'cancelled' && (
                 <Ionicons name="checkmark" size={16} color="#667EEA" />
               )}
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Transactions List */}
      {loading ? (
        <View style={styles.listContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <TransactionSkeleton key={index} />
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionCard item={item} onPress={handleTransactionPress} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={60} color="#E0E0E0" />
              <Text style={styles.emptyStateText}>No transactions found</Text>
              <Text style={styles.emptyStateSubtext}>
                Your transaction history will appear here
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: '#667EEA',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  filterButton: {
    padding: 4,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 999,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
  },
  filterContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    marginBottom: 16,
    position: 'relative',
  },
  filterDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 120,
  },
  filterDropdownText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginRight: 8,
  },
  filtersDropdown: {
    position: 'absolute',
    top: 0,
    right: Spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 1000,
    minWidth: 180,
    borderWidth: 0,
    overflow: 'hidden',
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  filterOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
  activeFilterOption: {
    backgroundColor: '#F0F4FF',
  },
  activeFilterOptionText: {
    color: '#667EEA',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 80,
  },
  listHeader: {
    paddingBottom: Spacing.sm,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  transactionCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 3,
  },
  ownerName: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 3,
  },
  durationText: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 3,
  },
  amountStatusContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  perDayText: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    ...TextStyles.body.small,
    color: '#999999',
    textAlign: 'center',
  },
});
