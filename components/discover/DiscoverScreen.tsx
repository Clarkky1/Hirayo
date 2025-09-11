import { BorderRadius, Colors, Shadows, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useSearch } from '@/contexts/SearchContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Item } from '@/lib/supabase';
import { itemsService } from '@/services/itemsService';
import { debounce, SearchableItem, searchItems } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ItemCardSkeleton } from '../common/SkeletonLoader';
import { ProductCard } from '../ui/ProductCard';

interface ProductItem extends SearchableItem {
  id: string;
  name: string;
  rating: number;
  location: string;
  price: number;
  category: string;
  images?: string[];
  description?: string;
}

export default function DiscoverScreen() {
  const sortOptions = [
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'rating', label: 'Highest Rated' },
    { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' }
  ];
  
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [priceRanges, setPriceRanges] = useState<{id: string, label: string, min: number, max: number}[]>([]);
  const params = useLocalSearchParams();
  const { searchQuery, setSearchQuery, addToHistory } = useSearch();
  const { user } = useSupabaseAuth();
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Load items from Supabase
  const loadItems = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const filters = {
        category: selectedCategory || undefined,
        location: selectedLocation || undefined,
        search: searchQuery || undefined,
      };
      
      const { data, error } = await itemsService.getItems(filters);
      
      if (error) {
        console.error('Error loading items:', error);
        setError('Failed to load items');
        return;
      }
      
      // Convert Supabase items to ProductItem format
      const convertedItems: ProductItem[] = (data || []).map((item: Item) => ({
        id: item.id,
        name: item.name,
        rating: item.rating,
        location: item.location,
        price: item.price_per_day,
        category: item.category,
        images: item.images,
        description: item.description,
      }));
      
      setProducts(convertedItems);
      setFilteredProducts(convertedItems);
      
      // Extract filter options from the data
      const categories = [...new Set(convertedItems.map(item => item.category))].sort();
      const locations = [...new Set(convertedItems.map(item => item.location))].sort();
      
      // Calculate price ranges dynamically
      const prices = convertedItems.map(item => item.price).sort((a, b) => a - b);
      const minPrice = Math.floor(prices[0] / 500) * 500; // Round down to nearest 500
      const maxPrice = Math.ceil(prices[prices.length - 1] / 500) * 500; // Round up to nearest 500
      
      const ranges = [];
      for (let i = minPrice; i < maxPrice; i += 500) {
        const rangeId = `${i}-${i + 500}`;
        const rangeLabel = `₱${i.toLocaleString()} - ₱${(i + 500).toLocaleString()}`;
        ranges.push({
          id: rangeId,
          label: rangeLabel,
          min: i,
          max: i + 500
        });
      }
      
      setAvailableCategories(categories);
      setAvailableLocations(locations);
      setPriceRanges(ranges);
    } catch (err) {
      console.error('Error loading items:', err);
      setError('Failed to load items');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory, selectedLocation, searchQuery]);

  // Load items on component mount and when filters change
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      const results = searchItems(products, query, {
        category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
        location: selectedLocation || undefined,
      });
      setFilteredProducts(results as ProductItem[]);
    }, 300),
    [selectedCategories, selectedLocation]
  );

  // Handle search input changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle search button press
  const handleSearch = () => {
    if (searchQuery.trim()) {
      addToHistory(searchQuery);
      const results = searchItems(products, searchQuery, {
        category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
        location: selectedLocation || undefined,
      });
      setFilteredProducts(results as ProductItem[]);
    }
  };

  // Map category names to icons
  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      'camera': 'camera',
      'laptop': 'laptop',
      'phone': 'phone-portrait',
      'pc': 'desktop',
      'tablet/ipad': 'tablet-portrait',
      'gaming': 'game-controller',
      'audio': 'headset',
      'drone': 'airplane',
    };
    return iconMap[category.toLowerCase()] || 'cube';
  };

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
    setSelectedCategories([]);
  };

  const getFilteredCategories = () => {
    let filtered = availableCategories;
    
    if (selectedLocation) {
      // Filter categories based on location availability
      // This would typically come from your backend
      filtered = filtered.filter(cat => 
        ['camera', 'laptop', 'phone', 'pc'].includes(cat.toLowerCase())
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

  // Handle search parameter from navigation
  useEffect(() => {
    if (params.search) {
      const searchParam = params.search as string;
      setSearchQuery(searchParam);
      const results = searchItems(products, searchParam, {
        category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
        location: selectedLocation || undefined,
      });
      setFilteredProducts(results as ProductItem[]);
    }
  }, [params.search, selectedCategories, selectedLocation]);

  // Update filtered products when filters change
  useEffect(() => {
    const results = searchItems(products, searchQuery, {
      category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
      location: selectedLocation || undefined,
    });
    setFilteredProducts(results as ProductItem[]);
  }, [selectedCategories, selectedLocation, searchQuery]);

  const handleSortBy = () => {
    setShowSortDropdown(!showSortDropdown);
    setShowFiltersDropdown(false);
  };

  const handleFilters = () => {
    setShowFiltersDropdown(!showFiltersDropdown);
    setShowSortDropdown(false);
  };

  const handleSortOptionSelect = (option: { id: string; label: string }) => {
    setSelectedSort(option.id);
    setShowSortDropdown(false);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        const filtered = prev.filter(c => c !== category);
        // If no categories left, clear all filtering
        if (filtered.length === 0) {
          setSelectedCategory(null);
        }
        return filtered;
      } else {
        return [...prev, category];
      }
    });
  };



  const handleApplyFilters = () => {
    setShowFiltersDropdown(false);
    // Apply the selected category filter - replace previous categories with new one
    if (selectedCategory) {
      const categoryMap: { [key: string]: string } = {
        'camera': 'Camera',
        'laptop': 'Laptop',
        'phone': 'Phone',
        'tablet': 'Tablet/iPad',
        'drone': 'Drone',
        'pc': 'PC',
        'gaming': 'Gaming',
        'audio': 'Audio'
      };
      
      const categoryName = categoryMap[selectedCategory];
      if (categoryName) {
        // Replace all previous categories with the new selected one
        setSelectedCategories([categoryName]);
        // Clear the selectedCategory since it's now applied to selectedCategories
        setSelectedCategory(null);
      }
    }
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedCategory(null);
  };

  const handleCategoryNavigation = (categoryId: string) => {
    handleCategoryToggle(categoryId);
  };

  // Apply price range filtering to the already filtered products
  const getPriceFilteredProducts = () => {
    if (!selectedSort) {
      return filteredProducts;
    }

    return filteredProducts.filter(product => {
      switch (selectedSort) {
        case '₱500 - ₱1,500':
          return product.price >= 500 && product.price <= 1500;
        case '₱1,500 - ₱2,500':
          return product.price >= 1500 && product.price <= 2500;
        case '₱2,500 - ₱3,500':
          return product.price >= 2500 && product.price <= 3500;
        case '₱3,500 - ₱4,500':
          return product.price >= 3500 && product.price <= 4500;
        case '₱4,500 - ₱5,500':
          return product.price >= 4500 && product.price <= 5500;
        case '₱5,500 - ₱6,500':
          return product.price >= 5500 && product.price <= 6500;
        case '₱6,500 - ₱7,500':
          return product.price >= 6500 && product.price <= 7500;
        case '₱7,500 - ₱8,500':
          return product.price >= 7500 && product.price <= 8500;
        case '₱8,500 - ₱9,500':
          return product.price >= 8500 && product.price <= 9500;
        case '₱9,500 - ₱10,000':
          return product.price >= 9500 && product.price <= 10000;
        default:
          return true;
      }
    });
  };

  const finalFilteredProducts = getPriceFilteredProducts();

  const handleRefresh = () => {
    loadItems(true);
  };

  const handlePostItem = () => {
    router.push('/post-item');
  };

  const renderProductItem = ({ item }: { item: ProductItem }) => (
    <ProductCard
      item={item}
      onPress={() => router.push('/item')}
      showFavoriteIcon={true}
      variant="default"
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={48} color={Colors.text.secondary} />
      <Text style={styles.emptyStateTitle}>No items found</Text>
      <Text style={styles.emptyStateText}>
        Try adjusting your search or filters to find what you're looking for.
      </Text>
      {user && (
        <TouchableOpacity style={styles.postItemButton} onPress={handlePostItem}>
          <Ionicons name="add" size={20} color={Colors.text.inverse} />
          <Text style={styles.postItemButtonText}>Post Your First Item</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderLoadingState = () => {
    // Create skeleton data that matches the grid layout
    const skeletonData = Array.from({ length: 8 }, (_, index) => ({ id: `skeleton-${index}` }));
    
    return (
      <FlatList
        data={skeletonData}
        renderItem={() => <ItemCardSkeleton />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productsRow}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
      />
    );
  };



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: '#667EEA', height: 0 }} />
      {/* Sticky Header Section */}
      <View style={styles.stickyHeader}>


        {/* Search Bar */}
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for gadgets..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearchChange}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Post Item Button for Lenders */}
        {user && (
          <TouchableOpacity style={styles.postItemHeaderButton} onPress={handlePostItem}>
            <Ionicons name="add-circle" size={20} color={Colors.primary[500]} />
            <Text style={styles.postItemHeaderText}>Post Item</Text>
          </TouchableOpacity>
        )}

        {/* Sort and Filter Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={handleSortBy} activeOpacity={0.7}>
            <Ionicons name="funnel-outline" size={16} color="#1F2937" />
            <Text style={styles.controlButtonText}>
              {selectedSort || 'Price Range'}
            </Text>
            <Ionicons name="chevron-down" size={14} color={Colors.text.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={handleFilters} activeOpacity={0.7}>
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
                  selectedSort === option.id && styles.selectedDropdownItem
                ]}
                onPress={() => handleSortOptionSelect(option)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.dropdownItemText,
                  selectedSort === option.id && styles.selectedDropdownItemText
                ]}>
                  {option.label}
                </Text>
                {selectedSort === option.id && (
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
                {availableCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      selectedCategories.includes(category) && styles.selectedCategoryChip
                    ]}
                    onPress={() => handleCategoryToggle(category)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={getCategoryIcon(category) as any} size={16} color={Colors.text.primary} />
                    <Text style={[
                      styles.categoryChipText,
                      selectedCategories.includes(category) && styles.selectedCategoryChipText
                    ]}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Locations */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Location</Text>
              <View style={styles.locationsGrid}>
                {availableLocations.map((location) => (
                  <TouchableOpacity
                    key={location}
                    style={[
                      styles.locationChip,
                      selectedLocation === location && styles.selectedLocationChip
                    ]}
                    onPress={() => setSelectedLocation(selectedLocation === location ? null : location)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="location" size={16} color={Colors.text.primary} />
                    <Text style={[
                      styles.locationChipText,
                      selectedLocation === location && styles.selectedLocationChipText
                    ]}>
                      {location}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.priceRangeGrid}>
                {priceRanges.map((range, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.priceRangeChip,
                      selectedSort === range.id && styles.selectedPriceRangeChip
                    ]}
                    onPress={() => handleSortOptionSelect({ id: range.id, label: range.label })}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.priceRangeChipText,
                      selectedSort === range.id && styles.selectedPriceRangeChipText
                    ]}>
                      {range.label}
                    </Text>
                    {selectedSort === range.id && (
                      <Ionicons name="checkmark" size={14} color={Colors.primary[500]} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>


            {/* Action Buttons */}
            <View style={styles.filterActions}>
              <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters} activeOpacity={0.7}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters} activeOpacity={0.7}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Active Filters Display */}
        {selectedCategories.length > 0 && (
          <View style={styles.activeFiltersContainer}>
            <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
            <View style={styles.activeFiltersChips}>
              {selectedCategories.map((category) => (
                <View key={category} style={styles.activeFilterChip}>
                  <Text style={styles.activeFilterChipText}>{category}</Text>
                  <TouchableOpacity onPress={() => handleCategoryToggle(category)} activeOpacity={0.7}>
                    <Ionicons name="close" size={16} color={Colors.text.inverse} />
                  </TouchableOpacity>
                </View>
              ))}

            </View>
          </View>
        )}

      </View>

      {/* Scrollable Products Section */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary[500]]}
            tintColor={Colors.primary[500]}
          />
        }
      >
        {/* Products Grid */}
        <View style={styles.productsSection}>
          {loading ? (
            renderLoadingState()
          ) : finalFilteredProducts.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={finalFilteredProducts}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.productsRow}
              contentContainerStyle={styles.productsList}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
            />
          )}
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
  stickyHeader: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    zIndex: 1000,
  },


  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },

          searchBar: {
          backgroundColor: Colors.background.secondary,
          borderRadius: BorderRadius.lg,
          paddingHorizontal: Spacing.sm,
          paddingVertical: Spacing.xs,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: Spacing.md,
          borderWidth: 1,
          borderColor: Colors.border.light,
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
    borderWidth: 1,
    borderColor: Colors.border.light,
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
    borderWidth: 1,
    borderColor: Colors.border.light,
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
  priceRangeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  priceRangeChip: {
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
  priceRangeChipText: {
    ...TextStyles.body.small,
    color: Colors.text.primary,
  },
  selectedPriceRangeChip: {
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[300],
  },
  selectedPriceRangeChipText: {
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
    borderWidth: 1,
    borderColor: Colors.border.light,
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
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  activeFilterChipText: {
    ...TextStyles.body.medium,
    color: Colors.text.inverse,
    fontWeight: '500',
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
    borderWidth: 1,
    borderColor: Colors.border.light,
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
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  chatIcon: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border.light,
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
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  postItemHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  postItemHeaderText: {
    ...TextStyles.body.medium,
    color: Colors.primary[500],
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  emptyStateTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptyStateText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  postItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    ...Shadows.sm,
  },
  postItemButtonText: {
    ...TextStyles.button.medium,
    color: Colors.text.inverse,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  loadingText: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
    marginTop: Spacing.md,
  },
});
