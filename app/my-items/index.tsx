import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Card } from '../../components/ui/Card';

interface MyItem {
  id: string;
  name: string;
  category: string;
  price: string;
  status: 'active' | 'rented' | 'inactive';
  rating: number;
  totalRentals: number;
  image?: string;
}

export default function MyItemsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'rented' | 'inactive'>('all');

  const myItems: MyItem[] = [
    {
      id: '1',
      name: 'Canon EOS R5 Camera',
      category: 'Cameras',
      price: '₱2,500 for a day',  
      status: 'active',
      rating: 4.9,
      totalRentals: 12
    },
    {
      id: '2',
      name: 'MacBook Pro M2',
      category: 'Laptops',
      price: '₱3,500 for a day',
      status: 'rented',
      rating: 4.8,
      totalRentals: 8
    },
    {
      id: '3',
      name: 'iPhone 15 Pro Max',
      category: 'Phones',
      price: '₱1,800 for a day',
      status: 'active',
      rating: 4.7,
      totalRentals: 15
    },
    {
      id: '4',
      name: 'DJI Mavic 3 Drone',
      category: 'Drones',
      price: '₱4,200 for a day',
      status: 'inactive',
      rating: 4.6,
      totalRentals: 6
    }
  ];

  const filteredItems = selectedFilter === 'all' 
    ? myItems 
    : myItems.filter(item => item.status === selectedFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return Colors.success;
      case 'rented': return Colors.warning;
      case 'inactive': return Colors.neutral[500];
      default: return Colors.neutral[500];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Available';
      case 'rented': return 'Currently Rented';
      case 'inactive': return 'Not Available';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return 'checkmark-circle';
      case 'rented': return 'time';
      case 'inactive': return 'pause-circle';
      default: return 'help-circle';
    }
  };

  const renderFilterButton = (filter: 'all' | 'active' | 'rented' | 'inactive', label: string, count: number) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
      <View style={[
        styles.filterCount,
        selectedFilter === filter && styles.filterCountActive
      ]}>
        <Text style={[
          styles.filterCountText,
          selectedFilter === filter && styles.filterCountTextActive
        ]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderItemCard = (item: MyItem) => (
    <Card key={item.id} variant="filled" padding="large" style={styles.itemCard}>
      {/* Item Header */}
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
        </View>
        <View style={styles.itemPrice}>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      </View>

      {/* Item Stats */}
      <View style={styles.itemStats}>
        <View style={styles.statItem}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.statText}>{item.rating}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="repeat" size={16} color={Colors.primary[500]} />
          <Text style={styles.statText}>{item.totalRentals} rentals</Text>
        </View>
      </View>

      {/* Status and Actions */}
      <View style={styles.itemFooter}>
        <View style={styles.statusContainer}>
          <Ionicons 
            name={getStatusIcon(item.status) as any} 
            size={16} 
            color={getStatusColor(item.status)} 
          />
          <Text style={[
            styles.statusText,
            { color: getStatusColor(item.status) }
          ]}>
            {getStatusText(item.status)}
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.viewButton}
            onPress={() => router.push({
              pathname: '/my-items/view',
              params: { itemId: item.id }
            })}
          >
            <Ionicons name="eye" size={16} color={Colors.text.inverse} />
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push({
              pathname: '/my-items/edit',
              params: { itemId: item.id }
            })}
          >
            <Ionicons name="create" size={16} color={Colors.text.inverse} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  const getFilterCounts = () => {
    return {
      all: myItems.length,
      active: myItems.filter(item => item.status === 'active').length,
      rented: myItems.filter(item => item.status === 'rented').length,
      inactive: myItems.filter(item => item.status === 'inactive').length
    };
  };

  const counts = getFilterCounts();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>My Items</Text>
            <Text style={styles.headerSubtitle}>Manage your rental items</Text>
          </View>
          <TouchableOpacity 
            style={styles.addItemButton}
            onPress={() => router.push('/post-item' as any)}
          >
            <Ionicons name="add" size={20} color={Colors.text.inverse} />
            <Text style={styles.addItemText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Card variant="filled" padding="large" style={styles.statCard}>
            <Ionicons name="cube" size={24} color={Colors.primary[500]} />
            <Text style={styles.statNumber}>{myItems.length}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </Card>
          <Card variant="filled" padding="large" style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            <Text style={styles.statNumber}>{counts.active}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </Card>
          <Card variant="filled" padding="large" style={styles.statCard}>
            <Ionicons name="time" size={24} color={Colors.warning} />
            <Text style={styles.statNumber}>{counts.rented}</Text>
            <Text style={styles.statLabel}>Rented</Text>
          </Card>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Filter Items</Text>
          <View style={styles.filterTabs}>
            {renderFilterButton('all', 'All', counts.all)}
            {renderFilterButton('active', 'Available', counts.active)}
            {renderFilterButton('rented', 'Rented', counts.rented)}
            {renderFilterButton('inactive', 'Inactive', counts.inactive)}
          </View>
        </View>

        {/* Items List */}
        <View style={styles.itemsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedFilter === 'all' ? 'All Items' : 
               selectedFilter === 'active' ? 'Available Items' :
               selectedFilter === 'rented' ? 'Currently Rented' : 'Inactive Items'}
            </Text>
            <Text style={styles.itemCount}>{filteredItems.length} items</Text>
          </View>

          {filteredItems.length > 0 ? (
            <View style={styles.itemsList}>
              {filteredItems.map(renderItemCard)}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={64} color={Colors.neutral[400]} />
              <Text style={styles.emptyStateTitle}>No items found</Text>
              <Text style={styles.emptyStateText}>
                {selectedFilter === 'all' ? 'You haven\'t added any items yet.' :
                 selectedFilter === 'active' ? 'No available items at the moment.' :
                 selectedFilter === 'rented' ? 'No items are currently rented.' : 'No inactive items.'}
              </Text>
              {selectedFilter === 'all' && (
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => router.push('/post-item' as any)}
                >
                  <Text style={styles.emptyStateButtonText}>Add Your First Item</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          <Card variant="filled" padding="large" style={styles.helpCard}>
            <View style={styles.helpItem}>
              <Ionicons name="information-circle" size={20} color={Colors.primary[500]} />
              <Text style={styles.helpText}>Keep your item descriptions clear and accurate</Text>
            </View>
            <View style={styles.helpItem}>
              <Ionicons name="camera" size={20} color={Colors.success} />
              <Text style={styles.helpText}>Upload high-quality photos of your items</Text>
            </View>
            <View style={styles.helpItem}>
              <Ionicons name="settings" size={20} color={Colors.warning} />
              <Text style={styles.helpText}>Update availability and pricing regularly</Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...TextStyles.heading.h1,
    color: Colors.text.primary,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
  },
  addItemButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addItemText: {
    ...TextStyles.body.small,
    color: Colors.text.inverse,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  statCard: {
    alignItems: 'center',
    width: '30%',
  },
  statNumber: {
    ...TextStyles.heading.h2,
    color: Colors.primary[500],
    fontWeight: 'bold',
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
    gap: Spacing.xs,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.background.primary,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary[500],
  },
  filterButtonText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  filterCount: {
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    marginLeft: Spacing.xs,
    minWidth: 20,
    alignItems: 'center',
  },
  filterCountActive: {
    backgroundColor: Colors.text.inverse,
  },
  filterCountText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    fontWeight: '600',
    fontSize: 11,
  },
  filterCountTextActive: {
    color: Colors.primary[500],
  },
  itemsSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  itemCount: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
  },
  itemsList: {
    gap: Spacing.md,
  },
  itemCard: {
    marginBottom: Spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...TextStyles.body.large,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  itemCategory: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
  },
  itemPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    ...TextStyles.body.medium,
    color: Colors.primary[500],
    fontWeight: '600',
  },
  itemStats: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statusText: {
    ...TextStyles.body.small,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
    gap: Spacing.xs,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary[500],
    borderWidth: 1,
    borderColor: Colors.primary[500],
    gap: Spacing.xs,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.warning,
    borderWidth: 1,
    borderColor: Colors.warning,
    gap: Spacing.xs,
  },
  actionButtonText: {
    ...TextStyles.body.small,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  viewButtonText: {
    ...TextStyles.body.small,
    color: Colors.text.inverse,
    fontWeight: '500',
  },
  editButtonText: {
    ...TextStyles.body.small,
    color: Colors.text.inverse,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyStateTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: '600',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emptyStateButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  emptyStateButtonText: {
    ...TextStyles.body.medium,
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  helpSection: {
    marginBottom: Spacing.xl,
  },
  helpCard: {
    // Card component handles styling
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  helpText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    flex: 1,
  },
});
