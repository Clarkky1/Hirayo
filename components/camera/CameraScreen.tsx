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
    name: 'Canon EOS R5',
    price: 3899,
    rating: 4.8,
    image: 'https://via.placeholder.com/150x150?text=Canon+R5',
    category: 'camera'
  },
  {
    id: '2',
    name: 'Sony A7 IV',
    price: 2499,
    rating: 4.7,
    image: 'https://via.placeholder.com/150x150?text=Sony+A7+IV',
    category: 'camera'
  },
  {
    id: '3',
    name: 'Nikon Z6 II',
    price: 1999,
    rating: 4.6,
    image: 'https://via.placeholder.com/150x150?text=Nikon+Z6+II',
    category: 'camera'
  },
  {
    id: '4',
    name: 'Fujifilm X-T4',
    price: 1699,
    rating: 4.5,
    image: 'https://via.placeholder.com/150x150?text=Fujifilm+X-T4',
    category: 'camera'
  },
  {
    id: '5',
    name: 'Panasonic Lumix S5',
    price: 1999,
    rating: 4.4,
    image: 'https://via.placeholder.com/150x150?text=Panasonic+S5',
    category: 'camera'
  },
  {
    id: '6',
    name: 'Canon EOS R6',
    price: 2499,
    rating: 4.7,
    image: 'https://via.placeholder.com/150x150?text=Canon+R6',
    category: 'camera'
  }
];

const sortOptions = [
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'name', label: 'Name A-Z' }
];

const filterCategories = [
  { id: 'camera', label: 'Camera', icon: 'camera' },
  { id: 'lens', label: 'Lens', icon: 'aperture' },
  { id: 'accessories', label: 'Accessories', icon: 'bag' }
];

const priceRanges = [
  { id: 'under-1000', label: 'Under $1,000' },
  { id: '1000-2000', label: '$1,000 - $2,000' },
  { id: '2000-3000', label: '$2,000 - $3,000' },
  { id: 'over-3000', label: 'Over $3,000' }
];

export default function CameraScreen() {
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
        case 'under-1000':
          filtered = filtered.filter(product => product.price < 1000);
          break;
        case '1000-2000':
          filtered = filtered.filter(product => product.price >= 1000 && product.price <= 2000);
          break;
        case '2000-3000':
          filtered = filtered.filter(product => product.price >= 2000 && product.price <= 3000);
          break;
        case 'over-3000':
          filtered = filtered.filter(product => product.price > 3000);
          break;
      }
    }
    
    return filtered;
  };

  const renderProductItem = ({ item }: { item: ProductItem }) => (
    <TouchableOpacity 
      style={styles.productItem}
      onPress={() => router.push(`/item/${item.id}`)}
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
        <Text style={styles.title}>Camera & Photography</Text>
        <Text style={styles.subtitle}>Discover amazing camera gear</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cameras, lenses, accessories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterSortContainer}>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity style={styles.filterSortButton} onPress={handleSortBy}>
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
          <TouchableOpacity style={styles.filterSortButton} onPress={handleFilters}>
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
                <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
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
                  >
                    <Ionicons name="close" size={14} color="#007AFF" />
                  </TouchableOpacity>
                </View>
              );
            })}
            <TouchableOpacity style={styles.clearAllButton} onPress={handleClearFilters}>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
