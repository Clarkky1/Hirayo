import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useSearch } from '@/contexts/SearchContext';
import { debounce, SearchableItem, searchItems } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
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
import { ProductCard } from '../ui/ProductCard';

interface ProductItem extends SearchableItem {
  id: string;
  name: string;
  rating: number;
  location: string;
  price: number;
  category: string;
}

const products: ProductItem[] = [
  { id: '1', name: 'Canon EOS R5 Mirrorless Camera', rating: 4.8, location: 'Talisay, Cebu', price: 2500, category: 'camera' },
  { id: '2', name: 'MacBook Pro M2 14-inch', rating: 4.9, location: 'Cebu City', price: 3500, category: 'laptop' },
  { id: '3', name: 'iPhone 15 Pro Max', rating: 4.7, location: 'Mandaue City', price: 1800, category: 'phone' },
  { id: '4', name: 'iPad Pro 12.9" M2', rating: 4.6, location: 'Lapu-Lapu City', price: 2200, category: 'tablet' },
  { id: '5', name: 'DJI Mavic 3 Pro Drone', rating: 4.9, location: 'Cebu City', price: 4200, category: 'drone' },
  { id: '6', name: 'Gaming PC RTX 4080', rating: 4.7, location: 'Mandaue City', price: 3800, category: 'pc' },
  { id: '7', name: 'PlayStation 5', rating: 4.8, location: 'Lapu-Lapu City', price: 1200, category: 'gaming' },
  { id: '8', name: 'Sony WH-1000XM5 Headphones', rating: 4.6, location: 'Talisay, Cebu', price: 800, category: 'audio' },
];

  const sortOptions = ['₱500 - ₱1,500', '₱1,500 - ₱2,500', '₱2,500 - ₱3,500', '₱3,500 - ₱4,500', '₱4,500 - ₱5,500', '₱5,500 - ₱6,500', '₱6,500 - ₱7,500', '₱7,500 - ₱8,500', '₱8,500 - ₱9,500', '₱9,500 - ₱10,000'];
const filterCategories = ['Camera', 'Laptop', 'Phone', 'Tablet/iPad', 'Drone', 'PC', 'Gaming', 'Audio'];


export default function DiscoverScreen() {
  const params = useLocalSearchParams();
  const { searchQuery, setSearchQuery, addToHistory } = useSearch();
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>(products);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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
    setSelectedCategories([]);
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

  const handleSortOptionSelect = (option: string) => {
    setSelectedSort(option);
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

  const renderProductItem = ({ item }: { item: ProductItem }) => (
    <ProductCard
      item={item}
      onPress={() => router.push('/item')}
      showFavoriteIcon={true}
      variant="default"
    />
  );



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
                  selectedSort === option && styles.selectedDropdownItem
                ]}
                onPress={() => handleSortOptionSelect(option)}
                activeOpacity={0.7}
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
                    activeOpacity={0.7}
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
                    activeOpacity={0.7}
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
              <View style={styles.priceRangeGrid}>
                {sortOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.priceRangeChip,
                      selectedSort === option && styles.selectedPriceRangeChip
                    ]}
                    onPress={() => handleSortOptionSelect(option)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.priceRangeChipText,
                      selectedSort === option && styles.selectedPriceRangeChipText
                    ]}>
                      {option}
                    </Text>
                    {selectedSort === option && (
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Products Grid */}
        <View style={styles.productsSection}>
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
});
