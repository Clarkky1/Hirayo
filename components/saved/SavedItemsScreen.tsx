import { BorderRadius, Colors, Spacing } from '@/constants/DesignSystem';
import { useSavedItems } from '@/contexts/SavedItemsContext';
import { useSelectedItem } from '@/contexts/SelectedItemContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { savedItemsService } from '@/services/savedItemsService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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
import { ItemCardSkeleton } from '../common/SkeletonLoader';

export default function SavedItemsScreen() {
  const { savedItems, removeSavedItem } = useSavedItems();
  const { setSelectedItem } = useSelectedItem();
  const { user } = useSupabaseAuth();
  const [isNavigating, setIsNavigating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasSavedItems = savedItems.length > 0;

  // Load saved items from Supabase
  const loadSavedItems = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await savedItemsService.getSavedItems(user.id);
      
      if (error) {
        console.error('Error loading saved items:', error);
        setError('Failed to load saved items');
        return;
      }
      
      // Convert Supabase saved items to the format expected by the context
      const convertedItems = (data || []).map((savedItem: any) => ({
        id: savedItem.item.id,
        name: savedItem.item.name,
        rating: savedItem.item.rating,
        location: savedItem.item.location,
        price: savedItem.item.price_per_day,
        category: savedItem.item.category,
        images: savedItem.item.images,
        description: savedItem.item.description,
      }));
      
      // Update the context with the loaded items
      // Note: You might need to add a method to the SavedItemsContext to set items
      // For now, we'll work with the existing context
    } catch (err) {
      console.error('Error loading saved items:', err);
      setError('Failed to load saved items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedItems();
  }, [user]);

  const handleItemPress = async (item: any) => {
    if (isNavigating) return; // Prevent multiple clicks
    
    setIsNavigating(true);
    setSelectedItem(item);
    
    try {
      await router.push('/item');
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      // Reset after a short delay to allow navigation to complete
      setTimeout(() => setIsNavigating(false), 1000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: '#667EEA', height: 0 }} />
             {/* Header */}
       <View style={styles.header}>
         <View style={styles.backButton} />
         <View style={styles.searchButton} />
       </View>

      {/* Conditional Rendering based on saved items */}
      {loading ? (
        /* Loading State - Grid Layout like Discover */
        <View style={styles.savedItemsContainer}>
          <FlatList
            data={Array.from({ length: 8 }, (_, index) => ({ id: `skeleton-${index}` }))}
            renderItem={() => <ItemCardSkeleton />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productsRow}
            contentContainerStyle={styles.productsList}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
          />
        </View>
      ) : !hasSavedItems ? (
        /* Empty State - No Saved Items */
        <View style={styles.emptyStateContainer}>
          <Ionicons name="heart-outline" size={80} color="#E0E0E0" />
          <Text style={styles.emptyStateTitle}>No Saved Items</Text>
          <Text style={styles.emptyStateSubtitle}>
            Items you save will appear here
          </Text>
        </View>
      ) : (
        /* Saved Items List */
        <View style={styles.savedItemsContainer}>
          <FlatList
            data={savedItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                             <TouchableOpacity 
                 style={[styles.savedItemCard, isNavigating && styles.disabledCard]}
                 onPress={() => handleItemPress(item)}
                 activeOpacity={isNavigating ? 1 : 0.7}
                 disabled={isNavigating}
               >
                                 <View style={styles.savedItemInfo}>
                   <Text style={styles.savedItemName}>{item.name}</Text>
                   <Text style={styles.savedItemLocation}>{item.location}</Text>
                   <Text style={styles.savedItemPrice}>₱{item.price}/day</Text>
                   {isNavigating && (
                     <View style={styles.loadingIndicator}>
                       <Text style={styles.loadingText}>Opening...</Text>
                     </View>
                   )}
                 </View>
                <TouchableOpacity 
                  style={styles.unsaveButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    removeSavedItem(item.id);
                  }}
                >
                  <Ionicons name="heart" size={20} color="#00A86B" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
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

  },
  backButton: {
    padding: 4,
  },
  searchButton: {
    padding: 4,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 0,
    marginTop: 0,
  },
  savedItemCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  disabledCard: {
    opacity: 0.6,
  },
  loadingIndicator: {
    marginTop: Spacing.xs,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666666',
    marginTop: 16,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 22,
  },
  savedItemsContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 0,
  },
  productsRow: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  productsList: {
    paddingBottom: 20,
  },

  savedItemInfo: {
    flex: 1,
  },
  savedItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 3,
  },
  savedItemLocation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 3,
  },
  savedItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary[500],
  },
  unsaveButton: {
    padding: 6,
  },

});
