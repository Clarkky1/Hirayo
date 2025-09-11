import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useLender } from '@/contexts/LenderContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Item } from '@/lib/supabase';
import { itemsService } from '@/services/itemsService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ItemCardSkeleton } from '../common/SkeletonLoader';
import { WideCard } from '../ui/WideCard';

interface CategoryItem {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const categories: CategoryItem[] = [
  { id: '1', name: 'Camera', icon: 'camera' },
  { id: '2', name: 'Laptop', icon: 'laptop' },
  { id: '3', name: 'Phone', icon: 'phone-portrait' },
  { id: '4', name: 'Tablet/iPad', icon: 'tablet-portrait' },
  { id: '5', name: 'Drone', icon: 'airplane' },
  { id: '6', name: 'PC', icon: 'desktop' },
  { id: '7', name: 'Gaming', icon: 'game-controller' },
  { id: '8', name: 'Audio', icon: 'headset' },
];

export default function HomeScreen() {
  const [isNavigating, setIsNavigating] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasClickedGetStarted, setHasClickedGetStarted } = useLender();
  const { user } = useSupabaseAuth();

  // Load items from Supabase
  const loadItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await itemsService.getItems();
      
      if (error) {
        console.error('Error loading items:', error);
        return;
      }
      
      setItems(data || []);
    } catch (err) {
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const preventMultipleNavigation = async (navigationFunction: () => void) => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    try {
      await navigationFunction();
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setTimeout(() => setIsNavigating(false), 1000);
    }
  };

  const handleCategoryPress = (category: CategoryItem) => {
    preventMultipleNavigation(() => 
      router.push({
        pathname: '/discover',
        params: { category: category.name.toLowerCase() }
      })
    );
  };

  const handleExploreItemPress = (item: Item) => {
    preventMultipleNavigation(() => router.push({
      pathname: '/item',
      params: { itemId: item.id }
    }));
  };

  const handleMessageLender = (item: Item) => {
    // Navigate to messages with item context
    preventMultipleNavigation(() => 
      router.push({
        pathname: '/messages',
        params: { 
          itemId: item.id,
          itemName: item.name,
          lenderLocation: item.location
        }
      })
    );
  };

  const renderCategoryItem = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity 
      style={[styles.categoryItem, isNavigating && styles.disabledItem]} 
      onPress={() => handleCategoryPress(item)}
      disabled={isNavigating}
      activeOpacity={isNavigating ? 1 : 0.7}
    >
      <View style={styles.categoryIconContainer}>
        <Ionicons name={item.icon} size={24} color={Colors.primary[500]} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const ExploreCard: React.FC<{ item: Item }> = ({ item }) => (
    <WideCard
      item={{
        ...item,
        price: item.price_per_day
      }}
      onPress={() => handleExploreItemPress(item)}
      showFavoriteIcon={true}
    />
  );

  // Get explore items (first 4 items)
  const exploreItems = items.slice(0, 4);
  
  // Get popular items (items 4-8, or remaining items)
  const popularItems = items.slice(4, 8);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: '#667EEA', height: 0 }} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Categories Section */}
        <View style={styles.categoriesSectionContainer}>
          <View style={styles.categoriesSection}>
          <View style={styles.categoriesHeader}>
            <Text style={styles.categoriesTitle}>Categories</Text>
          </View>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <View key={category.id} style={styles.categoryItemWrapper}>
                {renderCategoryItem({ item: category })}
              </View>
            ))}
          </View>
        </View>
        </View>

        {/* Explore Section */}
        <View style={styles.exploreSectionContainer}>
          <View style={styles.exploreSection}>
            <View style={styles.exploreHeader}>
              <Text style={styles.exploreTitle}>Explore</Text>
              <TouchableOpacity onPress={() => router.push('/discover')} activeOpacity={0.7}>
                <Text style={styles.moreText}>More</Text>
              </TouchableOpacity>
            </View>
            {loading ? (
              <View style={styles.skeletonContainer}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <ItemCardSkeleton key={index} isHorizontal={true} />
                ))}
              </View>
            ) : exploreItems.length > 0 ? (
              <FlatList
                data={exploreItems}
                renderItem={({ item }) => <ExploreCard item={item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.exploreList}
                ItemSeparatorComponent={() => <View style={{ width: Spacing.md }} />}
              />
            ) : (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="search-outline" size={32} color={Colors.text.secondary} />
                <Text style={styles.emptyStateText}>No items yet</Text>
                <Text style={styles.emptyStateSubtext}>Check back later for new items</Text>
              </View>
            )}
          </View>
        </View>

        {/* Popular Section */}
        <View style={styles.popularSectionContainer}>
          <View style={styles.popularSection}>
            <View style={styles.popularHeader}>
              <Text style={styles.popularTitle}>Popular</Text>
              <TouchableOpacity onPress={() => router.push('/discover')} activeOpacity={0.7}>
                <Text style={styles.moreText}>More</Text>
              </TouchableOpacity>
            </View>
            {loading ? (
              <View style={styles.skeletonContainer}>
                {Array.from({ length: 3 }).map((_, index) => (
                  <ItemCardSkeleton key={index} isHorizontal={true} />
                ))}
              </View>
            ) : popularItems.length > 0 ? (
              <FlatList
                data={popularItems}
                renderItem={({ item }) => <ExploreCard item={item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.popularList}
                ItemSeparatorComponent={() => <View style={{ width: Spacing.md }} />}
              />
            ) : (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="trending-up-outline" size={32} color={Colors.text.secondary} />
                <Text style={styles.emptyStateText}>No popular items yet</Text>
                <Text style={styles.emptyStateSubtext}>Items will appear here as they gain popularity</Text>
              </View>
            )}
          </View>
        </View>

        {/* Become a Lender Section - Only show if user hasn't clicked Get Started */}
        {!hasClickedGetStarted && (
          <View style={styles.lenderSectionContainer}>
            <View style={styles.lenderSection}>
            <View style={styles.lenderContent}>
              <Text style={styles.lenderTitle}>Become a Lender</Text>
              <Text style={styles.lenderSubtitle}>Start earning by renting out your items</Text>
              <TouchableOpacity 
                style={styles.lenderButton} 
                onPress={() => {
                  setHasClickedGetStarted(true);
                  router.push('/lenders' as any);
                }}
              >
                <Text style={styles.lenderButtonText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.text.inverse} />
              </TouchableOpacity>
            </View>
          </View>
          </View>
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
    paddingTop: Spacing.md,
  },
  scrollViewContent: {
    paddingBottom: 100, // Add padding to the bottom of the ScrollView
  },
  categoriesSectionContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  exploreSectionContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  popularSectionContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  lenderSectionContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing['6xl'],
    marginTop: Spacing.xs,
  },
  categoriesSection: {
    marginBottom: 0,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  categoriesTitle: {
    ...TextStyles.heading.h2,
    color: Colors.text.primary,
    fontWeight: 'bold',
  },

  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItemWrapper: {
    width: '23%',
    marginBottom: Spacing.sm,
  },
  categoryItem: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    height: 80,
    width: '100%',
    justifyContent: 'center',
  },
  categoryIconContainer: {
    marginBottom: Spacing.xs,
  },
  categoryName: {
    ...TextStyles.caption,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  exploreSection: {
    marginBottom: 0,
  },
  exploreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  exploreTitle: {
    ...TextStyles.heading.h2,
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
  moreText: {
    ...TextStyles.link,
    color: Colors.primary[500],
  },
  exploreList: {
    paddingHorizontal: 0,
    paddingBottom: Spacing.sm,
  },


  exploreCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    width: 240,
    height: 280,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  exploreImagePlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.neutral[300],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  exploreFavoriteIcon: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  exploreChatIcon: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  exploreCardDetails: {
    padding: Spacing.md,
    flex: 1,
    justifyContent: 'space-between',
  },
  exploreProductName: {
    ...TextStyles.body.small,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
    color: Colors.text.primary,
    lineHeight: 18,
  },
  exploreRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  exploreRatingText: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  exploreLocationText: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  explorePriceText: {
    ...TextStyles.body.small,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  explorePerDayText: {
    ...TextStyles.caption,
    fontWeight: '400',
    color: Colors.text.tertiary,
  },
  categoryCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  popularSection: {
    marginBottom: 0,
  },
  popularHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  popularTitle: {
    ...TextStyles.heading.h2,
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
  popularList: {
    paddingHorizontal: 0,
    paddingBottom: Spacing.sm,
  },

  lenderSection: {
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  lenderContent: {
    alignItems: 'center',
  },
  lenderTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  lenderSubtitle: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  lenderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  lenderButtonText: {
    ...TextStyles.body.small,
    color: Colors.text.inverse,
    fontWeight: 'bold',
    marginRight: Spacing.xs,
  },
  disabledItem: {
    opacity: 0.6,
  },
  skeletonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: 0,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  emptyStateText: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
