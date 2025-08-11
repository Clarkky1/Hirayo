import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

interface ProductItem {
  id: string;
  name: string;
  rating: number;
  location: string;
  price: number;
  category: string;
}

const products: ProductItem[] = [
  { id: '1', name: 'Canon EOS R5', price: 3899, rating: 4.8, image: 'https://via.placeholder.com/150x150?text=Canon+R5', category: 'camera' },
  { id: '2', name: 'Sony A7 IV', price: 2499, rating: 4.7, image: 'https://via.placeholder.com/150x150?text=Sony+A7+IV', category: 'camera' },
  { id: '3', name: 'Nikon Z6 II', price: 1999, rating: 4.6, image: 'https://via.placeholder.com/150x150?text=Nikon+Z6+II', category: 'camera' },
  { id: '4', name: 'Fujifilm X-T4', price: 1699, rating: 4.5, image: 'https://via.placeholder.com/150x150?text=Fujifilm+X-T4', category: 'camera' },
  { id: '5', name: 'Canon EOS 90D', price: 1199, rating: 4.4, image: 'https://via.placeholder.com/150x150?text=Canon+90D', category: 'camera' },
  { id: '6', name: 'Sony A6400', price: 899, rating: 4.3, image: 'https://via.placeholder.com/150x150?text=Sony+A6400', category: 'camera' },
];

const sortOptions = [
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'name', label: 'Name A-Z' },
  { id: 'location', label: 'Nearest' },
];

const filterCategories = [
  { id: 'camera', label: 'Camera', icon: 'camera' },
  { id: 'lens', label: 'Lens', icon: 'aperture' },
  { id: 'accessories', label: 'Accessories', icon: 'bag' },
  { id: 'tripod', label: 'Tripod', icon: 'camera' },
  { id: 'lighting', label: 'Lighting', icon: 'bulb' },
];

const priceRanges = [
  '0-500',
  '500-1000',
  '1000-2000',
  '2000+'
];

export default function CameraScreen() {
  const { initialCategory } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory as string]);
    }
  }, [initialCategory]);

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  const handleSortBy = () => {
    setShowSortDropdown(!showSortDropdown);
    setShowFiltersDropdown(false);
  };

  const handleFilters = () => {
    setShowFiltersDropdown(!showFiltersDropdown);
    setShowSortDropdown(false);
  };

  const handleSortOptionSelect = (sortId: string) => {
    setSelectedSort(sortId);
    setShowSortDropdown(false);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategoryNavigation = (categoryId: string) => {
    // Filter locally instead of navigating
    handleCategoryToggle(categoryId);
  };

  const handlePriceRangeSelect = (priceRange: string) => {
    setSelectedPriceRange(priceRange === selectedPriceRange ? '' : priceRange);
  };

  const handleApplyFilters = () => {
    setShowFiltersDropdown(false);
    console.log('Filters applied:', { selectedCategories, selectedPriceRange });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRange('');
  };

  const handleProductPress = (item: ProductItem) => {
    console.log('Product pressed:', item.name);
  };



  const getSortedProducts = () => {
    let sortedProducts = [...products];
    
    switch (selectedSort) {
      case 'price-low':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'location':
        // For demo purposes, keeping original order
        break;
    }
    
    return sortedProducts;
  };

  const getFilteredProducts = () => {
    let filteredProducts = getSortedProducts();
    
    // Filter by categories if any are selected
    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        selectedCategories.includes(product.category.toLowerCase())
      );
    }
    
    // Filter by price range if selected
    if (selectedPriceRange) {
      const [minPrice, maxPrice] = selectedPriceRange.split('-').map(Number);
      filteredProducts = filteredProducts.filter(product => {
        if (selectedPriceRange === '2000+') {
          return product.price >= 2000;
        }
        return product.price >= minPrice && product.price <= maxPrice;
      });
    }
    
    return filteredProducts;
  };

  const ProductCard: React.FC<{ item: ProductItem }> = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleProductPress(item)}>
      <View style={styles.imagePlaceholder}>
        <TouchableOpacity style={styles.favoriteIcon}>
          <Ionicons name="heart-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <Text style={styles.locationText}>{item.location}</Text>
        <Text style={styles.priceText}>
          ₱{item.price.toLocaleString()} <Text style={styles.perDayText}>for a day</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderActiveFilters = () => {
    const activeFilters = [];
    
    if (selectedCategories.length > 0) {
      selectedCategories.forEach(category => {
        const categoryInfo = filterCategories.find(c => c.id === category);
        if (categoryInfo) {
          activeFilters.push(
            <TouchableOpacity
              key={`cat-${category}`}
              style={styles.activeFilterChip}
              onPress={() => handleCategoryToggle(category)}
            >
              <Text style={styles.activeFilterText}>{categoryInfo.label}</Text>
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          );
        }
      });
    }
    
    if (selectedPriceRange) {
      activeFilters.push(
        <TouchableOpacity
          key="price"
          style={styles.activeFilterChip}
          onPress={() => setSelectedPriceRange('')}
        >
          <Text style={styles.activeFilterText}>₱{selectedPriceRange}</Text>
          <Ionicons name="close" size={16} color="#fff" />
        </TouchableOpacity>
      );
    }
    
    if (activeFilters.length > 0) {
      return (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
          <View style={styles.activeFiltersList}>
            {activeFilters}
          </View>
          <TouchableOpacity style={styles.clearAllButton} onPress={handleClearFilters}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>


        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search cameras, lenses, accessories..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sort and Filter Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={handleSortBy}>
            <Ionicons name="swap-vertical" size={16} color="#333" />
            <Text style={styles.controlButtonText}>
              {selectedSort ? sortOptions.find(s => s.id === selectedSort)?.label : 'Sort by'}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={handleFilters}>
            <Ionicons name="filter" size={16} color="#333" />
            <Text style={styles.controlButtonText}>Filters</Text>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Sort Dropdown */}
        {showSortDropdown && (
          <View style={styles.dropdown}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.dropdownItem,
                  selectedSort === option.id && styles.selectedDropdownItem
                ]}
                onPress={() => handleSortOptionSelect(option.id)}
              >
                <Text style={[
                  styles.dropdownItemText,
                  selectedSort === option.id && styles.selectedDropdownItemText
                ]}>
                  {option.label}
                </Text>
                {selectedSort === option.id && (
                  <Ionicons name="checkmark" size={16} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Filters Dropdown */}
        {showFiltersDropdown && (
          <View style={styles.filtersDropdown}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Categories</Text>
              <View style={styles.categoriesGrid}>
                {filterCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      selectedCategories.includes(category.id) && styles.selectedCategoryChip
                    ]}
                    onPress={() => handleCategoryNavigation(category.id)}
                  >
                    <Ionicons 
                      name={category.icon as any} 
                      size={20} 
                      color={selectedCategories.includes(category.id) ? '#fff' : '#333'} 
                    />
                    <Text style={[
                      styles.categoryChipText,
                      selectedCategories.includes(category.id) && styles.selectedCategoryChipText
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              {priceRanges.map((range) => (
                <TouchableOpacity
                  key={range}
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
                    ₱{range}
                  </Text>
                  {selectedPriceRange === range && (
                    <Ionicons name="checkmark" size={16} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.filterActions}>
              <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Active Filters Display */}
        {renderActiveFilters()}

        {/* Products Grid */}
        <View style={styles.productsContainer}>
          <FlatList
            data={getFilteredProducts()}
            renderItem={({ item }) => <ProductCard item={item} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.productRow}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },

  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    gap: 8,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  dropdown: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedDropdownItem: {
    backgroundColor: '#f0f8ff',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDropdownItemText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  filtersDropdown: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  filterSection: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 6,
  },
  selectedCategoryChip: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  selectedCategoryChipText: {
    color: '#fff',
  },
  priceRangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedPriceRangeItem: {
    backgroundColor: '#f0f8ff',
  },
  priceRangeText: {
    fontSize: 16,
    color: '#333',
  },
  selectedPriceRangeText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  filterActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 16,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  activeFiltersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  activeFiltersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  activeFiltersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  activeFilterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  clearAllButton: {
    alignSelf: 'flex-start',
  },
  clearAllText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  productsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardDetails: {
    gap: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
  locationText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  perDayText: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#666',
  },
});
