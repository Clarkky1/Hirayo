import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useLender } from '@/contexts/LenderContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { WideCard } from '../ui/WideCard';

interface CategoryItem {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface ExploreItem {
  id: string;
  name: string;
  rating: number;
  location: string;
  price: number;
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

const exploreItems: ExploreItem[] = [
  { id: '1', name: 'Canon EOS R5 Mirrorless Camera', rating: 4.8, location: 'Talisay, Cebu', price: 2500 },
  { id: '2', name: 'MacBook Pro M2 14-inch', rating: 4.9, location: 'Cebu City', price: 3500 },
  { id: '3', name: 'iPhone 15 Pro Max', rating: 4.7, location: 'Mandaue City', price: 1800 },
  { id: '4', name: 'iPad Pro 12.9" M2', rating: 4.6, location: 'Lapu-Lapu City', price: 2200 },
];

const popularItems: ExploreItem[] = [
  { id: 'p1', name: 'DJI Mavic 3 Pro Drone', rating: 4.9, location: 'Cebu City', price: 4200 },
  { id: 'p2', name: 'Gaming PC RTX 4080', rating: 4.7, location: 'Mandaue City', price: 3800 },
  { id: 'p3', name: 'PlayStation 5', rating: 4.8, location: 'Lapu-Lapu City', price: 1200 },
  { id: 'p4', name: 'Sony WH-1000XM5 Headphones', rating: 4.6, location: 'Talisay, Cebu', price: 800 },
  { id: 'p5', name: 'GoPro Hero 11 Black', rating: 4.8, location: 'Cebu City', price: 1500 },
];

export default function HomeScreen() {
  const [isNavigating, setIsNavigating] = useState(false);
  const { setHasClickedGetStarted } = useLender();

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

  const handleExploreItemPress = (item: ExploreItem) => {
    preventMultipleNavigation(() => router.push('/item'));
  };

  const handleMessageLender = (item: ExploreItem) => {
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

  const ExploreCard: React.FC<{ item: ExploreItem }> = ({ item }) => (
    <WideCard
      item={item}
      onPress={() => handleExploreItemPress(item)}
      showFavoriteIcon={true}
    />
  );

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
          <FlatList
            data={exploreItems}
            renderItem={({ item }) => <ExploreCard item={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.exploreList}
            ItemSeparatorComponent={() => <View style={{ width: Spacing.md }} />}
          />
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
          <FlatList
            data={popularItems}
            renderItem={({ item }) => <ExploreCard item={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularList}
            ItemSeparatorComponent={() => <View style={{ width: Spacing.md }} />}
          />
        </View>
        </View>

        {/* Become a Lender Section */}
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
});
