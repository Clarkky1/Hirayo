import { BorderRadius, Colors, Shadows, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

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
  { id: '1', name: 'Canon EOS R5 Mirrorless Camera', rating: 4.8, location: 'Talisay, Cebu', price: 45 },
  { id: '2', name: 'MacBook Pro M2 14-inch', rating: 4.9, location: 'Cebu City', price: 35 },
  { id: '3', name: 'iPhone 15 Pro Max', rating: 4.7, location: 'Mandaue City', price: 25 },
  { id: '4', name: 'iPad Pro 12.9" M2', rating: 4.6, location: 'Lapu-Lapu City', price: 30 },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const handleCategoryPress = (category: CategoryItem) => {
    router.push({
      pathname: '/discover',
      params: { category: category.name.toLowerCase() }
    });
  };

  const handleMore = () => {
    router.push('/discover');
  };

  const handleExploreItemPress = (item: ExploreItem) => {
    router.push('/item');
  };

  const renderCategoryItem = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity 
      style={styles.categoryItem} 
      onPress={() => handleCategoryPress(item)}
    >
      <View style={styles.categoryIconContainer}>
        <Ionicons name={item.icon} size={24} color={Colors.primary[500]} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const ExploreCard: React.FC<{ item: ExploreItem }> = ({ item }) => (
    <TouchableOpacity style={styles.exploreCard} onPress={() => handleExploreItemPress(item)}>
      <View style={styles.exploreImagePlaceholder}>
        <TouchableOpacity style={styles.exploreFavoriteIcon}>
          <Ionicons name="heart-outline" size={16} color={Colors.neutral[600]} />
        </TouchableOpacity>
      </View>
      <View style={styles.exploreCardDetails}>
        <Text style={styles.exploreProductName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.exploreRatingContainer}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.exploreRatingText}>{item.rating}</Text>
        </View>
        <Text style={styles.exploreLocationText}>{item.location}</Text>
        <Text style={styles.explorePriceText}>
          ₱{item.price.toLocaleString()} <Text style={styles.explorePerDayText}>for a day</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for gadgets..."
            placeholderTextColor={Colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={16} color={Colors.text.inverse} />
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <View style={styles.categoriesHeader}>
            <Text style={styles.categoriesTitle}>Categories</Text>
            <TouchableOpacity style={styles.postItemButton} onPress={() => router.push('/post-item' as any)}>
              <Ionicons name="add" size={16} color={Colors.text.inverse} />
              <Text style={styles.postItemText}>Post Item</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <View key={category.id} style={styles.categoryItemWrapper}>
                {renderCategoryItem({ item: category })}
              </View>
            ))}
          </View>
        </View>

        {/* Explore Section */}
        <View style={styles.exploreSection}>
          <View style={styles.exploreHeader}>
            <Text style={styles.exploreTitle}>Explore</Text>
            <TouchableOpacity onPress={handleMore}>
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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  searchBar: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  searchInput: {
    flex: 1,
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    marginRight: Spacing.sm,
  },
  searchButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
    ...Shadows.sm,
  },
  categoriesSection: {
    marginBottom: Spacing.lg,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  categoriesTitle: {
    ...TextStyles.heading.h2,
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
  postItemButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.sm,
  },
  postItemText: {
    ...TextStyles.body.small,
    color: Colors.text.inverse,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },

  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItemWrapper: {
    width: '23%',
    marginBottom: Spacing.md,
  },
  categoryItem: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    height: 80,
    width: '100%',
    justifyContent: 'center',
    ...Shadows.base,
    borderWidth: 1,
    borderColor: Colors.border.light,
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
    marginBottom: Spacing.md,
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
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
  },

  exploreCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    width: 200,
    height: 280,
    overflow: 'hidden',
    ...Shadows.sm,
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
    ...Shadows.sm,
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
    ...Shadows.xs,
  },
});
