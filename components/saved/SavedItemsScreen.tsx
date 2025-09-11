import { Spacing } from '@/constants/DesignSystem';
import { useSavedItems } from '@/contexts/SavedItemsContext';
import { useSelectedItem } from '@/contexts/SelectedItemContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { ProductCard } from '../ui/ProductCard';

interface ProductItem {
  id: string;
  name: string;
  rating: number;
  location: string;
  price: number;
  category: string;
  images?: string[];
  description?: string;
  image?: string;
  ownerName?: string;
  ownerAvatar?: string;
}

export default function SavedItemsScreen() {
  const { savedItems, removeSavedItem } = useSavedItems();
  const { setSelectedItem } = useSelectedItem();
  const { user } = useSupabaseAuth();
  const [isNavigating, setIsNavigating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert savedItems from context to ProductItem format
  const products: ProductItem[] = savedItems.map((savedItem) => ({
    id: savedItem.id,
    name: savedItem.name,
    rating: savedItem.rating || 0,
    location: savedItem.location,
    price: savedItem.price,
    category: savedItem.category || 'General',
    images: savedItem.image ? [savedItem.image] : undefined,
    description: savedItem.description,
    image: savedItem.image,
    ownerName: savedItem.ownerName || 'Unknown Owner',
    ownerAvatar: savedItem.ownerAvatar,
  }));

  const hasSavedItems = products.length > 0;

  // Cleanup function to prevent state updates after unmount
  useEffect(() => {
    return () => {
      setLoading(false);
      setError(null);
    };
  }, []);

  const handleItemPress = async (item: ProductItem) => {
    if (isNavigating) return; // Prevent multiple clicks
    
    setIsNavigating(true);
    setSelectedItem(item);
    
    try {
      await router.push({
        pathname: '/item',
        params: { itemId: item.id }
      });
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      // Reset after a short delay to allow navigation to complete
      setTimeout(() => setIsNavigating(false), 1000);
    }
  };

  const renderProductItem = ({ item }: { item: ProductItem }) => (
    <ProductCard
      item={item}
      onPress={() => handleItemPress(item)}
      showFavoriteIcon={true}
      variant="default"
    />
  );


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
      {!hasSavedItems ? (
        /* Empty State - No Saved Items */
        <View style={styles.emptyStateContainer}>
          <Ionicons name="heart-outline" size={80} color="#E0E0E0" />
          <Text style={styles.emptyStateTitle}>No Saved Items</Text>
          <Text style={styles.emptyStateSubtitle}>
            Items you save will appear here
          </Text>
        </View>
      ) : (
        /* Saved Items Grid - Same layout as Discover page */
        <View style={styles.savedItemsContainer}>
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productsRow}
            contentContainerStyle={styles.productsList}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
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

});
