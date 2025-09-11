  import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { LenderItem, lenderService } from '@/services/lenderService';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  LogBox,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Card } from '../../components/ui/Card';

LogBox.ignoreAllLogs(true);


export default function MyItemsScreen() {                                                          
  const { user } = useSupabaseAuth();
  const params = useLocalSearchParams();
  const highlightItemId = params.highlightItemId as string;
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'rented' | 'inactive'>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [myItems, setMyItems] = useState<LenderItem[]>([]);

  const loadItems = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const items = await lenderService.getLenderItems(user.id);
      setMyItems(items);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  }, [loadItems]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filteredItems = selectedFilter === 'all' 
    ? myItems 
    : myItems.filter(item => {
      if (selectedFilter === 'active') return item.is_available;
      if (selectedFilter === 'rented') return !item.is_available && item.total_rentals > 0;
      if (selectedFilter === 'inactive') return !item.is_available && item.total_rentals === 0;
      return true;
    });

  const getStatusColor = (item: LenderItem) => {
    if (item.is_available) return Colors.success;
    if (item.total_rentals > 0) return Colors.warning;
    return Colors.neutral[500];
  };

  const getStatusText = (item: LenderItem) => {
    if (item.is_available) return 'Available';
    if (item.total_rentals > 0) return 'Currently Rented';
    return 'Not Available';
  };

  const getStatusIcon = (item: LenderItem) => {
    if (item.is_available) return 'checkmark-circle';
    if (item.total_rentals > 0) return 'time';
    return 'pause-circle';
  };

  // CRUD Functions
  const handleCreateItem = () => {
    router.push('/post-item' as any);
  };

  const handleEditItem = (item: LenderItem) => {
    router.push({
      pathname: '/post-item' as any,
      params: { editItem: JSON.stringify(item) }
    });
  };

  const handleDeleteItem = (item: LenderItem) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await lenderService.deleteItem(item.id);
              await loadItems(); // Refresh the list
              Alert.alert('Success', 'Item deleted successfully');
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleToggleAvailability = async (item: LenderItem) => {
    try {
      await lenderService.toggleItemAvailability(item.id, !item.is_available);
      await loadItems(); // Refresh the list
    } catch (error) {
      console.error('Error toggling availability:', error);
      Alert.alert('Error', 'Failed to update item availability. Please try again.');
    }
  };

  const renderFilterButton = (filter: 'all' | 'active' | 'rented' | 'inactive', label: string, count: number) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter)}
      activeOpacity={0.7}
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

  const renderItemCard = (item: LenderItem) => {
    const cardStyle = item.id === highlightItemId 
      ? { ...styles.itemCard, ...styles.highlightedItemCard }
      : styles.itemCard;
    
    return (
      <Card 
        key={item.id} 
        variant="filled" 
        padding="large" 
        style={cardStyle}
      >
              {/* Item Header */}
        <View style={styles.itemHeader}>
          <View style={styles.itemInfo}>
            <View style={styles.itemNameRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.id === highlightItemId && (
                <View style={styles.highlightBadge}>
                  <Ionicons name="star" size={12} color="#FFFFFF" />
                  <Text style={styles.highlightBadgeText}>From Messages</Text>
                </View>
              )}
            </View>
            <Text style={styles.itemCategory}>{item.category}</Text>
          </View>
          <View style={styles.itemPrice}>
            <Text style={styles.priceText}>₱{item.price_per_day}/day</Text>
          </View>
        </View>

      {/* Item Stats */}
      <View style={styles.itemStats}>
        <View style={styles.statItem}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.statText}>{item.rating.toFixed(1)}</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="repeat" size={16} color={Colors.primary[500]} />
          <Text style={styles.statText}>{item.total_rentals} rentals</Text>
        </View>
      </View>

      {/* Status and Actions */}
      <View style={styles.itemFooter}>
        <View style={styles.statusContainer}>
          <Ionicons 
            name={getStatusIcon(item) as any} 
            size={16} 
            color={getStatusColor(item)} 
          />
          <Text style={[
            styles.statusText,
            { color: getStatusColor(item) }
          ]}>
            {getStatusText(item)}
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={() => handleToggleAvailability(item)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={item.is_available ? "pause" : "play"} 
              size={16} 
              color={Colors.text.inverse} 
            />
            <Text style={styles.toggleButtonText}>
              {item.is_available ? 'Pause' : 'Activate'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditItem(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="create" size={16} color={Colors.text.inverse} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteItem(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash" size={16} color={Colors.text.inverse} />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
    );
  };

  const getFilterCounts = () => {
    return {
      all: myItems.length,
      active: myItems.filter(item => item.is_available).length,
      rented: myItems.filter(item => !item.is_available && item.total_rentals > 0).length,
      inactive: myItems.filter(item => !item.is_available && item.total_rentals === 0).length
    };
  };

  const counts = getFilterCounts();

  // Auto-scroll to highlighted item when navigating from messages
  useEffect(() => {
    if (highlightItemId && scrollViewRef.current) {
      // Find the index of the highlighted item
      const itemIndex = myItems.findIndex(item => item.id === highlightItemId);
      if (itemIndex !== -1) {
        // Calculate approximate scroll position (each item card height + margins)
        const estimatedItemHeight = 200; // Approximate height of each item card
        const scrollPosition = itemIndex * estimatedItemHeight;
        
        // Scroll to the highlighted item with a slight delay for smooth animation
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: scrollPosition,
            animated: true
          });
        }, 500);
      }
    }
  }, [highlightItemId]);

  const renderSkeletonLoader = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonHeader}>
        <SkeletonLoader width="50%" height={28} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="70%" height={16} />
      </View>
      
      <View style={styles.skeletonStatsSection}>
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} style={styles.skeletonStatCard}>
            <SkeletonLoader width={24} height={24} style={{ marginBottom: 8 }} />
            <SkeletonLoader width="60%" height={20} style={{ marginBottom: 4 }} />
            <SkeletonLoader width="80%" height={12} />
          </View>
        ))}
      </View>

      <View style={styles.skeletonFilterSection}>
        <SkeletonLoader width="40%" height={20} style={{ marginBottom: 16 }} />
        <View style={styles.skeletonFilterTabs}>
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonLoader key={index} width="22%" height={36} borderRadius={8} />
          ))}
        </View>
      </View>

      <View style={styles.skeletonItemsSection}>
        <View style={styles.skeletonSectionHeader}>
          <SkeletonLoader width="40%" height={20} />
          <SkeletonLoader width="20%" height={16} />
        </View>
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} style={styles.skeletonItemCard}>
            <View style={styles.skeletonItemHeader}>
              <View style={styles.skeletonItemInfo}>
                <SkeletonLoader width="80%" height={18} style={{ marginBottom: 8 }} />
                <SkeletonLoader width="60%" height={14} />
              </View>
              <SkeletonLoader width="30%" height={16} />
            </View>
            <View style={styles.skeletonItemStats}>
              <SkeletonLoader width="40%" height={16} />
              <SkeletonLoader width="40%" height={16} />
            </View>
            <View style={styles.skeletonItemFooter}>
              <SkeletonLoader width="50%" height={16} />
              <View style={styles.skeletonActionButtons}>
                <SkeletonLoader width="60" height={32} borderRadius={6} />
                <SkeletonLoader width="60" height={32} borderRadius={6} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#667EEA']}
            tintColor="#667EEA"
          />
        }
      >
        {loading ? (
          renderSkeletonLoader()
        ) : (
          <>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>My Items</Text>
                <Text style={styles.headerSubtitle}>Manage your rental items</Text>
              </View>
              <TouchableOpacity 
                style={styles.addItemButton}
                onPress={() => router.push('/post-item' as any)}
                activeOpacity={0.7}
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
                      activeOpacity={0.7}
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
          </>
        )}
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
  highlightedItemCard: {
    borderWidth: 3,
    borderColor: Colors.primary[500],
    backgroundColor: Colors.background.secondary,
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  highlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  highlightBadgeText: {
    ...TextStyles.body.small,
    color: Colors.text.inverse,
    fontSize: 10,
    fontWeight: '600',
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
  // Skeleton loading styles
  skeletonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  skeletonHeader: {
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  skeletonStatsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  skeletonStatCard: {
    alignItems: 'center',
    width: '30%',
    paddingVertical: Spacing.md,
  },
  skeletonFilterSection: {
    marginBottom: Spacing.lg,
  },
  skeletonFilterTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  skeletonItemsSection: {
    marginBottom: Spacing.lg,
  },
  skeletonSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  skeletonItemCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  skeletonItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  skeletonItemInfo: {
    flex: 1,
  },
  skeletonItemStats: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  skeletonItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonActionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
