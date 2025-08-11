import { BorderRadius, Colors, Shadows, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ProductItem {
  id: string;
  name: string;
  rating: number;
  location: string;
  price: number;
  category: string;
}

const products: ProductItem[] = [
  { id: '1', name: 'Canon EOS R5 Mirrorless Camera', rating: 4.8, location: 'Talisay, Cebu', price: 45, category: 'camera' },
  { id: '2', name: 'MacBook Pro M2 14-inch', rating: 4.9, location: 'Cebu City', price: 35, category: 'laptop' },
  { id: '3', name: 'iPhone 15 Pro Max', rating: 4.7, location: 'Mandaue City', price: 25, category: 'phone' },
  { id: '4', name: 'iPad Pro 12.9" M2', rating: 4.6, location: 'Lapu-Lapu City', price: 30, category: 'tablet' },
  { id: '5', name: 'DJI Mavic 3 Pro Drone', rating: 4.9, location: 'Cebu City', price: 55, category: 'drone' },
  { id: '6', name: 'Gaming PC RTX 4080', rating: 4.7, location: 'Mandaue City', price: 40, category: 'pc' },
  { id: '7', name: 'PlayStation 5', rating: 4.8, location: 'Lapu-Lapu City', price: 20, category: 'gaming' },
  { id: '8', name: 'Sony WH-1000XM5 Headphones', rating: 4.6, location: 'Talisay, Cebu', price: 15, category: 'audio' },
];

const sortOptions = ['Price: Low to High', 'Price: High to Low', 'Rating: High to Low', 'Rating: Low to High', 'Newest First'];
const filterCategories = ['Camera', 'Laptop', 'Phone', 'Tablet/iPad', 'Drone', 'PC', 'Gaming', 'Audio'];
const priceRanges = ['Under ₱500', '₱500 - ₱1,000', '₱1,000 - ₱2,000', '₱2,000+'];

export default function DiscoverScreen() {
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'camera', name: 'Camera', icon: 'camera' },
    { id: 'laptop', name: 'Laptop', icon: 'laptop' },
    { id: 'phone', name: 'Phone', icon: 'phone-portrait' },
    { id: 'pc', name: 'PC', icon: 'desktop' },
    { id: 'tablet', name: 'Tablet', icon: 'tablet-portrait' },
    { id: 'gaming', name: 'Gaming', icon: 'game-controller' },
    { id: 'audio', name: 'Audio', icon: 'headset' },
    { id: 'drone', name: 'Drone', icon: 'airplane' },
  ];

  const locations = [
    { id: 'nearby', name: 'Nearby (0-5 km)', icon: 'location' },
    { id: 'same-city', name: 'Same City', icon: 'business' },
    { id: 'metro-manila', name: 'Metro Manila', icon: 'map' },
    { id: 'quezon-city', name: 'Quezon City', icon: 'location' },
    { id: 'makati', name: 'Makati', icon: 'business' },
    { id: 'manila', name: 'Manila', icon: 'map' },
    { id: 'taguig', name: 'Taguig', icon: 'location' },
    { id: 'pasig', name: 'Pasig', icon: 'business' },
  ];

  const handleCategoryPress = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const handleLocationPress = (locationId: string) => {
    if (selectedLocation === locationId) {
      setSelectedLocation(null);
    } else {
      setSelectedLocation(locationId);
    }
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedLocation(null);
  };

  const getFilteredCategories = () => {
    let filtered = categories;
    
    if (selectedLocation) {
      // Filter categories based on location availability
      // This would typically come from your backend
      filtered = filtered.filter(cat => 
        ['camera', 'laptop', 'phone', 'pc'].includes(cat.id)
      );
    }
    
    return filtered;
  };

  // Auto-filter by category if passed as route parameter
  useEffect(() => {
    if (params.category) {
      const categoryParam = params.category as string;
      const categoryMap: { [key: string]: string } = {
        'camera': 'Camera',
        'laptop': 'Laptop',
        'phone': 'Phone',
        'tablet/ipad': 'Tablet/iPad',
        'drone': 'Drone',
        'pc': 'PC',
        'gaming': 'Gaming',
        'audio': 'Audio'
      };
      
      const mappedCategory = categoryMap[categoryParam.toLowerCase()];
      if (mappedCategory) {
        setSelectedCategories([mappedCategory]);
      }
    }
  }, [params.category]);

  const handleSortBy = () => {
    setShowSortDropdown(!showSortDropdown);
    setShowFiltersDropdown(false);
  };

  const handleFilters = () => {
    setShowFiltersDropdown(!showFiltersDropdown);
    setShowSortDropdown(false);
  };

  const handleSortOptionSelect = (option: string) => {
    setSelectedSort(option);
    setShowSortDropdown(false);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceRangeSelect = (range: string) => {
    setSelectedPriceRange(range);
  };

  const handleApplyFilters = () => {
    setShowFiltersDropdown(false);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRange('');
  };

  const handleCategoryNavigation = (categoryId: string) => {
    handleCategoryToggle(categoryId);
  };

  const getSortedProducts = () => {
    let sorted = [...products];
    
    switch (selectedSort) {
      case 'Price: Low to High':
        return sorted.sort((a, b) => a.price - b.price);
      case 'Price: High to Low':
        return sorted.sort((a, b) => b.price - a.price);
      case 'Rating: High to Low':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'Rating: Low to High':
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  };

  const getFilteredProducts = () => {
    let filtered = getSortedProducts();
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.some(cat => 
          product.category.toLowerCase() === cat.toLowerCase()
        )
      );
    }
    
    if (selectedPriceRange) {
      filtered = filtered.filter(product => {
        switch (selectedPriceRange) {
          case 'Under ₱500':
            return product.price < 500;
          case '₱500 - ₱1,000':
            return product.price >= 500 && product.price <= 1000;
          case '₱1,000 - ₱2,000':
            return product.price > 1000 && product.price <= 2000;
          case '₱2,000+':
            return product.price > 2000;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const renderProductItem = ({ item }: { item: ProductItem }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => router.push('/item')}>
      <View style={styles.productImagePlaceholder}>
        <TouchableOpacity style={styles.favoriteIcon}>
          <Ionicons name="heart-outline" size={16} color={Colors.neutral[600]} />
        </TouchableOpacity>
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <Text style={styles.locationText}>{item.location}</Text>
        <Text style={styles.priceText}>
          ₱{item.price.toLocaleString()} <Text style={styles.perDayText}>for a day</Text>
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
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={16} color={Colors.text.inverse} />
          </TouchableOpacity>
        </View>

        {/* Sort and Filter Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={handleSortBy}>
            <Ionicons name="funnel-outline" size={16} color={Colors.text.primary} />
            <Text style={styles.controlButtonText}>
              {selectedSort || 'Sort by'}
            </Text>
            <Ionicons name="chevron-down" size={14} color={Colors.text.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={handleFilters}>
            <Ionicons name="options-outline" size={16} color={Colors.text.primary} />
            <Text style={styles.controlButtonText}>
              Filters
            </Text>
            <Ionicons name="chevron-down" size={14} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Sort Dropdown */}
        {showSortDropdown && (
          <View style={styles.dropdown}>
            {sortOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dropdownItem,
                  selectedSort === option && styles.selectedDropdownItem
                ]}
                onPress={() => handleSortOptionSelect(option)}
              >
                <Text style={[
                  styles.dropdownItemText,
                  selectedSort === option && styles.selectedDropdownItemText
                ]}>
                  {option}
                </Text>
                {selectedSort === option && (
                  <Ionicons name="checkmark" size={14} color={Colors.primary[500]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Filters Dropdown */}
        {showFiltersDropdown && (
          <View style={styles.filtersDropdown}>
            {/* Categories */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Categories</Text>
              <View style={styles.categoriesGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      selectedCategory === category.id && styles.selectedCategoryChip
                    ]}
                    onPress={() => handleCategoryPress(category.id)}
                  >
                    <Ionicons name={category.icon as any} size={16} color={Colors.text.primary} />
                    <Text style={[
                      styles.categoryChipText,
                      selectedCategory === category.id && styles.selectedCategoryChipText
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Locations */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Location</Text>
              <View style={styles.locationsGrid}>
                {locations.map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    style={[
                      styles.locationChip,
                      selectedLocation === location.id && styles.selectedLocationChip
                    ]}
                    onPress={() => handleLocationPress(location.id)}
                  >
                    <Ionicons name={location.icon as any} size={16} color={Colors.text.primary} />
                    <Text style={[
                      styles.locationChipText,
                      selectedLocation === location.id && styles.selectedLocationChipText
                    ]}>
                      {location.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              {priceRanges.map((range, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.priceRangeItem,
                    selectedPriceRange === range && styles.selectedPriceRangeItem
                  ]}
                  onPress={() => handlePriceRangeSelect(range)}
                >
                  <Text style={[
                    styles.priceRangeText,
                    selectedPriceRange === range && styles.selectedPriceRangeText
                  ]}>
                    {range}
                  </Text>
                  {selectedPriceRange === range && (
                    <Ionicons name="checkmark" size={14} color={Colors.primary[500]} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.filterActions}>
              <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Active Filters Display */}
        {(selectedCategories.length > 0 || selectedPriceRange) && (
          <View style={styles.activeFiltersContainer}>
            <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
            <View style={styles.activeFiltersChips}>
              {selectedCategories.map((category) => (
                <View key={category} style={styles.activeFilterChip}>
                  <Text style={styles.activeFilterChipText}>{category}</Text>
                  <TouchableOpacity onPress={() => handleCategoryToggle(category)}>
                    <Ionicons name="close" size={12} color={Colors.text.inverse} />
                  </TouchableOpacity>
                </View>
              ))}
              {selectedPriceRange && (
                <View style={styles.activeFilterChip}>
                  <Text style={styles.activeFilterChipText}>{selectedPriceRange}</Text>
                  <TouchableOpacity onPress={() => setSelectedPriceRange('')}>
                    <Ionicons name="close" size={12} color={Colors.text.inverse} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Products Grid */}
        <View style={styles.productsSection}>
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productsRow}
            contentContainerStyle={styles.productsList}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },

          searchBar: {
          backgroundColor: Colors.background.secondary,
          borderRadius: BorderRadius.lg,
          paddingHorizontal: Spacing.sm,
          paddingVertical: Spacing.xs,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: Spacing.md,
          shadowColor: '#6B7280',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.03,
          shadowRadius: 3,
          elevation: 1,
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
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
    ...Shadows.softSm,
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.base,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  controlButtonText: {
    ...TextStyles.body.small,
    color: Colors.text.primary,
    flex: 1,
    marginLeft: Spacing.sm,
  },
  dropdown: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginTop: Spacing.xs,
    ...Shadows.softLg,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  selectedDropdownItem: {
    backgroundColor: Colors.primary[50],
  },
  dropdownItemText: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
  },
  selectedDropdownItemText: {
    color: Colors.primary[500],
    fontWeight: '600',
  },
  filtersDropdown: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.base,
  },
  filterSection: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  filterSectionTitle: {
    ...TextStyles.body.medium,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryChip: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  selectedCategoryChip: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  categoryChipText: {
    ...TextStyles.body.small,
    color: Colors.text.primary,
  },
  selectedCategoryChipText: {
    color: Colors.text.inverse,
  },
  locationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  locationChip: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  selectedLocationChip: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  locationChipText: {
    ...TextStyles.body.small,
    color: Colors.text.primary,
  },
  selectedLocationChipText: {
    color: Colors.text.inverse,
  },
  priceRangeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.base,
    marginBottom: Spacing.xs,
  },
  selectedPriceRangeItem: {
    backgroundColor: Colors.primary[50],
  },
  priceRangeText: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
  },
  selectedPriceRangeText: {
    color: Colors.primary[500],
    fontWeight: '600',
  },
  filterActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.md,
  },
  clearButton: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.base,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  clearButtonText: {
    ...TextStyles.button.medium,
    color: Colors.text.primary,
  },
  applyButton: {
    flex: 1,
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.base,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...Shadows.base,
  },
  applyButtonText: {
    ...TextStyles.button.medium,
    color: Colors.text.inverse,
  },
  activeFiltersContainer: {
    marginBottom: Spacing.lg,
  },
  activeFiltersTitle: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  activeFiltersChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  activeFilterChipText: {
    ...TextStyles.body.small,
    color: Colors.text.inverse,
  },
  productsSection: {
    marginBottom: Spacing.xl,
  },

  productsRow: {
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  productsList: {
    paddingBottom: Spacing.xl,
  },
  productCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    width: '48%',
    ...Shadows.sm,
  },
  productImagePlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.neutral[300],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  favoriteIcon: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
    ...Shadows.sm,
  },
  productDetails: {
    padding: Spacing.md,
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    ...TextStyles.body.small,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
    color: Colors.text.primary,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  ratingText: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  locationText: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  priceText: {
    ...TextStyles.body.small,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  perDayText: {
    ...TextStyles.caption,
    fontWeight: '400',
    color: Colors.text.tertiary,
  },
  filterChip: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
    ...Shadows.xs,
  },
});
