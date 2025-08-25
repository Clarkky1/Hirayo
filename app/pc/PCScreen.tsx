import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors, Spacing } from '../../constants/DesignSystem';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  location: string;
}

const PCScreen = () => {
  const { initialCategory } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory as string);
    }
  }, [initialCategory]);

  const products: ProductItem[] = [
    { id: '1', name: 'Alienware Aurora R15', price: 2499, rating: 4.8, image: 'https://via.placeholder.com/150x150?text=Alienware+Aurora+R15', category: 'pc', location: 'Cebu City' },
    { id: '2', name: 'HP Omen 30L', price: 1899, rating: 4.7, image: 'https://via.placeholder.com/150x150?text=HP+Omen+30L', category: 'pc', location: 'Mandaue City' },
    { id: '3', name: 'Corsair One i300', price: 3299, rating: 4.9, image: 'https://via.placeholder.com/150x150?text=Corsair+One+i300', category: 'pc', location: 'Lapu-Lapu City' },
    { id: '4', name: 'Lenovo Legion Tower 7i', price: 2199, rating: 4.6, image: 'https://via.placeholder.com/150x150?text=Lenovo+Legion+Tower+7i', category: 'pc', location: 'Talisay, Cebu' },
    { id: '5', name: 'Dell XPS 8960', price: 1799, rating: 4.5, image: 'https://via.placeholder.com/150x150?text=Dell+XPS+8960', category: 'pc', location: 'Cebu City' },
    { id: '6', name: 'ASUS ROG Strix G15', price: 1599, rating: 4.4, image: 'https://via.placeholder.com/150x150?text=ASUS+ROG+Strix+G15', category: 'pc', location: 'Mandaue City' },
  ];

  const sortOptions = [
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'rating', label: 'Highest Rated' },
    { id: 'name', label: 'Name A-Z' },
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

  const categories = [
    { id: 'gaming', name: 'Gaming', icon: 'game-controller' },
    { id: 'workstation', name: 'Workstation', icon: 'briefcase' },
    { id: 'all-in-one', name: 'All-in-One', icon: 'monitor' },
    { id: 'mini-pc', name: 'Mini PC', icon: 'hardware-chip' },
    { id: 'custom', name: 'Custom Built', icon: 'construct' },
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

  const handlePriceRangeSelect = (rangeId: string) => {
    setSelectedPriceRange(selectedPriceRange === rangeId ? '' : rangeId);
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

    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category === selectedCategory
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
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <TouchableOpacity 
          style={styles.chatIcon}
          onPress={(e) => {
            e.stopPropagation();
            handleMessageLender(item);
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubble-outline" size={16} color={Colors.primary[500]} />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₱{item.price.toLocaleString()}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <Text style={styles.locationText}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleMessageLender = (item: ProductItem) => {
    // Navigate to messages with item context
    router.push({
      pathname: '/messages',
      params: { 
        itemId: item.id,
        itemName: item.name,
        lenderLocation: item.location
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Desktop PCs & Workstations</Text>
          <Text style={styles.subtitle}>Powerful computing solutions for every need</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search PCs..."
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
                    <Ionicons 
                      name={category.icon as any} 
                      size={20} 
                      color={selectedCategory === category.id ? '#fff' : '#333'} 
                    />
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
                    <Ionicons 
                      name={location.icon as any} 
                      size={20} 
                      color={selectedLocation === location.id ? '#fff' : '#333'} 
                    />
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
              <TouchableOpacity style={styles.clearButton} onPress={() => {
                setSelectedCategory(null);
                setSelectedPriceRange('');
              }} activeOpacity={0.7}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={() => {
                setShowFiltersDropdown(false);
              }} activeOpacity={0.7}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {(selectedCategory || selectedLocation || selectedPriceRange) && (
          <View style={styles.activeFiltersContainer}>
            <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
            <View style={styles.activeFiltersChips}>
              {selectedCategory && (
                <TouchableOpacity
                  style={styles.activeFilterChip}
                  onPress={() => setSelectedCategory(null)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.activeFilterChipText}>
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </Text>
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              )}
              {selectedLocation && (
                <TouchableOpacity
                  style={styles.activeFilterChip}
                  onPress={() => setSelectedLocation(null)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.activeFilterChipText}>
                    {locations.find(l => l.id === selectedLocation)?.name}
                  </Text>
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              )}
              {selectedPriceRange && (
                <TouchableOpacity
                  style={styles.activeFilterChip}
                  onPress={() => setSelectedPriceRange('')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.activeFilterChipText}>
                    {priceRanges.find(r => r.id === selectedPriceRange)?.label}
                  </Text>
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <View style={styles.productsContainer}>
          <Text style={styles.productsTitle}>
            {filteredProducts.length} PC{filteredProducts.length !== 1 ? 's' : ''} found
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
    padding: Spacing.lg,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    padding: Spacing.lg,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  controlsContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  controlButtonText: {
    marginLeft: 6,
    marginRight: 6,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  dropdown: {
    position: 'absolute',
    top: 140,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
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
  locationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedLocationChip: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  locationChipText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedLocationChipText: {
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
    padding: 14,
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
    padding: Spacing.lg,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  activeFiltersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  activeFiltersChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeFilterChipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  productsContainer: {
    padding: Spacing.lg,
  },
  productsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 14,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  productItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  chatIcon: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: Spacing.xs,
    borderWidth: 1,
    borderColor: '#e9ecef',
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
  locationText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default PCScreen;
