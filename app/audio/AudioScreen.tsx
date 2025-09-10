import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  LogBox,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

LogBox.ignoreAllLogs(true);


interface ProductItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
}

const AudioScreen = () => {
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

  const products: ProductItem[] = [
    { id: '1', name: 'Sony WH-1000XM5', price: 399, rating: 4.9, image: 'https://via.placeholder.com/150x150?text=Sony+WH-1000XM5', category: 'audio' },
    { id: '2', name: 'Bose QuietComfort 45', price: 329, rating: 4.8, image: 'https://via.placeholder.com/150x150?text=Bose+QuietComfort+45', category: 'audio' },
    { id: '3', name: 'Apple AirPods Pro 2', price: 249, rating: 4.7, image: 'https://via.placeholder.com/150x150?text=AirPods+Pro+2', category: 'audio' },
    { id: '4', name: 'Samsung Galaxy Buds2 Pro', price: 229, rating: 4.6, image: 'https://via.placeholder.com/150x150?text=Galaxy+Buds2+Pro', category: 'audio' },
    { id: '5', name: 'Audio-Technica ATH-M50x', price: 149, rating: 4.5, image: 'https://via.placeholder.com/150x150?text=ATH-M50x', category: 'audio' },
    { id: '6', name: 'JBL Flip 6 Speaker', price: 129, rating: 4.4, image: 'https://via.placeholder.com/150x150?text=JBL+Flip+6', category: 'audio' },
  ];

  const sortOptions = [
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'rating', label: 'Highest Rated' },
    { id: 'name', label: 'Name A-Z' },
  ];

  const filterCategories = [
    { id: 'audio', label: 'Audio', icon: 'headset' },
    { id: 'headphones', label: 'Headphones', icon: 'headset' },
    { id: 'earbuds', label: 'Earbuds', icon: 'ear' },
    { id: 'speakers', label: 'Speakers', icon: 'volume-high' },
    { id: 'microphones', label: 'Microphones', icon: 'mic' },
  ];

  const priceRanges = [
    { id: '500-1500', label: '₱500 - ₱1,500' },
    { id: '1500-2500', label: '₱1,500 - ₱2,500' },
    { id: '2500-3500', label: '₱2,500 - ₱3,500' },
    { id: '3500-4500', label: '₱3,500 - ₱4,500' },
    { id: '4500-5500', label: '₱4,500 - ₱5,500' },
    { id: '5500-6500', label: '₱5,500 - ₱6,500' },
    { id: '6500-7500', label: '₱6,500 - ₱7,500' },
    { id: '7500-8500', label: '₱7,500 - ₱8,500' },
    { id: '8500-9500', label: '₱8,500 - ₱9,500' },
    { id: '9500-10000', label: '₱9,500 - ₱10,000' },
  ];

  const handleSortBy = () => {
    setShowSortDropdown(!showSortDropdown);
    setShowFiltersDropdown(false);
  };

  const handleFilters = () => {
    setShowFiltersDropdown(!showFiltersDropdown);
    setShowSortDropdown(false);
  };

  const handleSortOptionSelect = (optionId: string) => {
    setSelectedSort(optionId);
    setShowSortDropdown(false);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePriceRangeSelect = (rangeId: string) => {
    setSelectedPriceRange(selectedPriceRange === rangeId ? '' : rangeId);
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

  const getSortedProducts = (products: ProductItem[]) => {
    if (!selectedSort) return products;
    
    return [...products].sort((a, b) => {
      switch (selectedSort) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  const getFilteredProducts = () => {
    let filtered = products;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }

    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      if (max) {
        filtered = filtered.filter(product => 
          product.price >= min && product.price <= max
        );
      } else {
        filtered = filtered.filter(product => product.price >= min);
      }
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return getSortedProducts(filtered);
  };

  const filteredProducts = getFilteredProducts();

  const renderProductItem = ({ item }: { item: ProductItem }) => (
    <TouchableOpacity style={styles.productItem} activeOpacity={0.7}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
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
              activeOpacity={0.7}
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
          activeOpacity={0.7}
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
          <TouchableOpacity style={styles.clearAllButton} onPress={handleClearFilters} activeOpacity={0.7}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return null;
  };

  const renderFilterChips = () => {
    return (
      <View style={styles.filterChipsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipsScroll}
        >
          {filterCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.filterChip,
                selectedCategories.includes(category.id) && styles.filterChipActive
              ]}
              onPress={() => handleCategoryToggle(category.id)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={category.icon as any} 
                size={16} 
                color={selectedCategories.includes(category.id) ? '#fff' : '#333'} 
              />
              <Text style={[
                styles.filterChipText,
                selectedCategories.includes(category.id) && styles.filterChipTextActive
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Audio & Sound Equipment</Text>
          <Text style={styles.subtitle}>Premium audio solutions for every need</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search audio products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={handleSortBy} activeOpacity={0.7}>
            <Ionicons name="funnel-outline" size={20} color="#666666" />
            <Text style={styles.controlButtonText}>Sort</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={handleFilters} activeOpacity={0.7}>
            <Ionicons name="options-outline" size={20} color="#666666" />
            <Text style={styles.controlButtonText}>Filters</Text>
          </TouchableOpacity>
        </View>

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
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.dropdownItemText,
                  selectedSort === option.id && styles.selectedDropdownItemText
                ]}>
                  {option.label}
                </Text>
                {selectedSort === option.id && (
                  <Ionicons name="checkmark" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

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
                    activeOpacity={0.7}
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
                  key={range.id}
                  style={[
                    styles.priceRangeItem,
                    selectedPriceRange === range.id && styles.selectedPriceRangeItem
                  ]}
                  onPress={() => handlePriceRangeSelect(range.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.priceRangeText,
                    selectedPriceRange === range.id && styles.selectedPriceRangeText
                  ]}>
                    {range.label}
                  </Text>
                  {selectedPriceRange === range.id && (
                    <Ionicons name="checkmark" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.filterActions}>
              <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters} activeOpacity={0.7}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters} activeOpacity={0.7}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {renderActiveFilters()}

        <View style={styles.productsContainer}>
          <Text style={styles.productsTitle}>
            {filteredProducts.length} audio product{filteredProducts.length !== 1 ? 's' : ''} found
          </Text>
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.productRow}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  controlsContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  controlButtonText: {
    marginLeft: 8,
    marginRight: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  dropdown: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
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
    fontWeight: '600',
  },
  filtersDropdown: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    zIndex: 1000,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedCategoryChip: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryChipText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryChipText: {
    color: '#fff',
  },
  priceRangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
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
    fontWeight: '600',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  activeFiltersContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
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
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  activeFilterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  clearAllButton: {
    marginTop: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  clearAllText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  productsContainer: {
    padding: 20,
  },
  productsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  filterChipsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filterChipsScroll: {
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
  },
  filterChipText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
  },
});

export default AudioScreen;
