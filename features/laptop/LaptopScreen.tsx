import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
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
  const [selectedSort, setSelectedSort] = useState('rating');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');

  useEffect(() => {
    if (initialCategory) {
      setSelectedFilters([initialCategory as string]);
    }
  }, [initialCategory]);

  const handleProductPress = (product: ProductItem) => {
    router.push('/item');
  };

  const handleSort = (sortId: string) => {
    setSelectedSort(sortId);
    setShowSortDropdown(false);
  };

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const handlePriceRangeSelect = (rangeId: string) => {
    setSelectedPriceRange(prev => prev === rangeId ? '' : rangeId);
  };

  const renderProductItem = ({ item }: { item: ProductItem }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₱{item.price} for a day</Text>
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
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Laptops</Text>
        <TouchableOpacity>
          <Ionicons name="cart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search laptops..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => setShowSortDropdown(!showSortDropdown)}
          activeOpacity={0.7}
        >
          <Ionicons name="funnel-outline" size={20} color="#666" />
          <Text style={styles.controlButtonText}>Sort</Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => setShowFiltersDropdown(!showFiltersDropdown)}
          activeOpacity={0.7}
        >
          <Ionicons name="options-outline" size={20} color="#666" />
          <Text style={styles.controlButtonText}>Filters</Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {showSortDropdown && (
        <View style={styles.dropdown}>
          {sortOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.dropdownItem,
                selectedSort === option.id && styles.selectedDropdownItem
              ]}
              onPress={() => handleSort(option.id)}
              activeOpacity={0.7}
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

      {showFiltersDropdown && (
        <View style={styles.dropdown}>
          <Text style={styles.filterSectionTitle}>Categories</Text>
          {filterCategories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.filterItem,
                selectedFilters.includes(category.id) && styles.selectedFilterItem
              ]}
              onPress={() => handleFilterToggle(category.id)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={category.icon as any} 
                size={20} 
                color={selectedFilters.includes(category.id) ? "#007AFF" : "#666"} 
              />
              <Text style={[
                styles.filterItemText,
                selectedFilters.includes(category.id) && styles.selectedFilterItemText
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.filterSectionTitle}>Price Range</Text>
          {priceRanges.map(range => (
            <TouchableOpacity
              key={range.id}
              style={[
                styles.filterItem,
                selectedPriceRange === range.id && styles.selectedFilterItem
              ]}
              onPress={() => handlePriceRangeSelect(range.id)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterItemText,
                selectedPriceRange === range.id && styles.selectedFilterItemText
              ]}>
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.productsList}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
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
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  controlsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  controlButtonText: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: 14,
    color: '#666',
  },
  dropdown: {
    position: 'absolute',
    top: 200,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  selectedDropdownItem: {
    backgroundColor: '#f0f8ff',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000',
  },
  selectedDropdownItemText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 15,
    marginBottom: 10,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 5,
  },
  selectedFilterItem: {
    backgroundColor: '#f0f8ff',
  },
  filterItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  selectedFilterItemText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  productsList: {
    padding: 20,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 5,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
});
