import { BorderRadius, Colors, Spacing } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Transaction {
  id: string;
  itemName: string;
  ownerName: string;
  amount: number;
  status: 'completed' | 'active' | 'cancelled';
  date: string;
  duration: string;
  imageUrl?: string;
}

const transactions: Transaction[] = [
  {
    id: '2',
    itemName: 'MacBook Pro 16" M2',
    ownerName: 'Sarah Johnson',
    amount: 3200,
    status: 'active',
    date: 'Aug 20-22, 2025',
    duration: '3 days',
  },
  {
    id: '3',
    itemName: 'iPhone 15 Pro Max',
    ownerName: 'Mike Wilson',
    amount: 1800,
    status: 'cancelled',
    date: 'Aug 10-12, 2025',
    duration: '3 days',
  },
  {
    id: '4',
    itemName: 'Sony A7 III Mirrorless',
    ownerName: 'Emma Davis',
    amount: 4200,
    status: 'completed',
    date: 'Aug 5-8, 2025',
    duration: '4 days',
  },
  {
    id: '5',
    itemName: 'iPad Pro 12.9" M2',
    ownerName: 'David Brown',
    amount: 2400,
    status: 'active',
    date: 'Aug 25-27, 2025',
    duration: '3 days',
  },
];

const TransactionCard: React.FC<{ item: Transaction }> = ({ item }) => {
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
    <TouchableOpacity style={styles.transactionCard}>
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
        <Text style={styles.amount}>₱{item.amount.toLocaleString()}</Text>
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



  const filteredTransactions = activeFilter === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === activeFilter);

  const renderFilterButton = (filter: 'all' | 'completed' | 'active' | 'cancelled', label: string) => (
    <TouchableOpacity
      style={[styles.filterButton, activeFilter === filter && styles.activeFilterButton]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
             {/* Header */}
       <View style={styles.header}>
         <View style={styles.backButton} />
         <View style={styles.searchButton} />
       </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('active', 'Active')}
        {renderFilterButton('completed', 'Completed')}
        {renderFilterButton('cancelled', 'Cancelled')}
      </View>

      {/* Transactions List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionCard item={item} />}
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
    paddingBottom: 12,
  },
  backButton: {
    padding: 4,
  },
  searchButton: {
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginHorizontal: 3,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#0066CC',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  listContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 80,
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
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },

});
