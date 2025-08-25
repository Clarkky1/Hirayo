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

interface ProductItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
}

const products: ProductItem[] = [
  {
    id: '1',
    name: 'MacBook Pro 16" M2',
    price: 2499,
    rating: 4.9,
    image: 'https://via.placeholder.com/150x150?text=MacBook+Pro+16',
    category: 'laptop'
  },
  {
    id: '2',
    name: 'Dell XPS 13 Plus',
    price: 1299,
    rating: 4.7,
    image: 'https://via.placeholder.com/150x150?text=Dell+XPS+13',
    category: 'laptop'
  },
  {
    id: '3',
    name: 'Lenovo ThinkPad X1',
    price: 1599,
    rating: 4.6,
    image: 'https://via.placeholder.com/150x150?text=ThinkPad+X1',
    category: 'laptop'
  },
  {
    id: '4',
    name: 'HP Spectre x360',
    price: 1199,
    rating: 4.5,
    image: 'https://via.placeholder.com/150x150?text=HP+Spectre',
    category: 'laptop'
  },
  {
    id: '5',
    name: 'ASUS ROG Strix',
    price: 1899,
    rating: 4.4,
    image: 'https://via.placeholder.com/150x150?text=ROG+Strix',
    category: 'laptop'
  },
  {
    id: '6',
    name: 'Razer Blade 15',
    price: 2299,
    rating: 4.6,
    image: 'https://via.placeholder.com/150x150?text=Razer+Blade',
    category: 'laptop'
  }
];

const sortOptions = [
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'name', label: 'Name A-Z' }
];

const filterCategories = [
  { id: 'laptop', label: 'Laptop', icon: 'laptop' },
  { id: 'gaming', label: 'Gaming', icon: 'game-controller' },
  { id: 'business', label: 'Business', icon: 'briefcase' }
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
  { id: '9500-10000', label: '₱9,500 - ₱10,000' }
];

export default function LaptopScreen() {
  const { initialCategory } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState('price-low');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory as string]);
    }
  }, [initialCategory]);

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



  const handlePriceRangeSelect = (rangeId: string) => {
    setSelectedPriceRange(prev => prev === rangeId ? '' : rangeId);
  };

  const handleApplyFilters = () => {
    setShowFiltersDropdown(false);
    console.log('Applied filters:', { selectedCategories, selectedPriceRange });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRange('');
  };

  const getSortedProducts = () => {
    const sorted = [...products];
    switch (selectedSort) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  };

  const getFilteredProducts = () => {
    let filtered = getSortedProducts();
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    if (selectedPriceRange) {
      switch (selectedPriceRange) {
        case '500-1500':
          filtered = filtered.filter(product => product.price >= 500 && product.price <= 1500);
          break;
        case '1500-2500':
          filtered = filtered.filter(product => product.price >= 1500 && product.price <= 2500);
          break;
        case '2500-3500':
          filtered = filtered.filter(product => product.price >= 2500 && product.price <= 3500);
          break;
        case '3500-4500':
          filtered = filtered.filter(product => product.price >= 3500 && product.price <= 4500);
          break;
        case '4500-5500':
          filtered = filtered.filter(product => product.price >= 4500 && product.price <= 5500);
          break;
        case '5500-6500':
          filtered = filtered.filter(product => product.price >= 5500 && product.price <= 6500);
          break;
        case '6500-7500':
          filtered = filtered.filter(product => product.price >= 6500 && product.price <= 7500);
          break;
        case '7500-8500':
          filtered = filtered.filter(product => product.price >= 7500 && product.price <= 8500);
          break;
        case '8500-9500':
          filtered = filtered.filter(product => product.price >= 8500 && product.price <= 9500);
          break;
        case '9500-10000':
          filtered = filtered.filter(product => product.price >= 9500 && product.price <= 10000);
          break;
      }
    }
    
    return filtered;
  };

  const renderProductItem = ({ item }: { item: ProductItem }) => (
    <TouchableOpacity 
      style={styles.productItem}
      onPress={() => router.push('/item')}
      activeOpacity={0.7}
    >
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Laptops & Computers</Text>
        <Text style={styles.subtitle}>Find your perfect laptop</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search laptops, gaming PCs, business computers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterSortContainer}>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity style={styles.filterSortButton} onPress={handleSortBy} activeOpacity={0.7}>
            <Text style={styles.filterSortButtonText}>Sort by</Text>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </TouchableOpacity>
          
          {showSortDropdown && (
            <View style={styles.dropdown}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.sortOption}
                  onPress={() => handleSortOptionSelect(option.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.sortOptionText}>{option.label}</Text>
                  {selectedSort === option.id && (
                    <Ionicons name="checkmark" size={16} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.dropdownContainer}>
          <TouchableOpacity style={styles.filterSortButton} onPress={handleFilters} activeOpacity={0.7}>
            <Text style={styles.filterSortButtonText}>Filters</Text>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </TouchableOpacity>
          
          {showFiltersDropdown && (
            <View style={styles.filtersDropdown}>
              <ScrollView style={styles.filtersContent}>
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Categories</Text>
                  <View style={styles.categoriesContainer}>
                    {filterCategories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categoryChip,
                          selectedCategories.includes(category.id) && styles.categoryChipSelected
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
                          styles.categoryChipText,
                          selectedCategories.includes(category.id) && styles.categoryChipTextSelected
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
                        selectedPriceRange === range.id && styles.priceRangeItemSelected
                      ]}
                      onPress={() => handlePriceRangeSelect(range.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.priceRangeText,
                        selectedPriceRange === range.id && styles.priceRangeTextSelected
                      ]}>
                        {range.label}
                      </Text>
                      {selectedPriceRange === range.id && (
                        <Ionicons name="checkmark" size={16} color="#007AFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

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
        </View>
      </View>

      {selectedCategories.length > 0 && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersTitle}>Active Filters:</Text>
          <View style={styles.activeFiltersChips}>
            {selectedCategories.map((categoryId) => {
              const category = filterCategories.find(c => c.id === categoryId);
              return (
                <View key={categoryId} style={styles.activeFilterChip}>
                  <Ionicons name={category?.icon as any} size={14} color="#007AFF" />
                  <Text style={styles.activeFilterChipText}>{category?.label}</Text>
                  <TouchableOpacity
                    onPress={() => handleCategoryToggle(categoryId)}
                    style={styles.removeFilterButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={14} color="#007AFF" />
                  </TouchableOpacity>
                </View>
              );
            })}
            <TouchableOpacity style={styles.clearAllButton} onPress={handleClearFilters} activeOpacity={0.7}>
              <Text style={styles.clearAllButtonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={getFilteredProducts()}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
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
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  filterSortContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    gap: 15,
  },
  dropdownContainer: {
    flex: 1,
    position: 'relative',
  },
  filterSortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  filterSortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    zIndex: 1000,
    marginTop: 4,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#333',
  },
  filtersDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    zIndex: 1000,
    marginTop: 4,
    maxHeight: 400,
  },
  filtersContent: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 6,
  },
  categoryChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: '#fff',
  },
  priceRangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
  },
  priceRangeItemSelected: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  priceRangeText: {
    fontSize: 14,
    color: '#333',
  },
  priceRangeTextSelected: {
    color: '#007AFF',
    fontWeight: '500',
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  activeFiltersContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  activeFiltersTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 12,
  },
  activeFiltersChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#007AFF',
    gap: 6,
  },
  activeFilterChipText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  removeFilterButton: {
    padding: 2,
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  clearAllButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  productList: {
    padding: 20,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  productItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 5,
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
    gap: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
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
    gap: 4,
  },
  rating: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});
