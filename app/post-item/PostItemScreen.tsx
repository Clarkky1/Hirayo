import { Colors, Spacing } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface CategoryOption {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const categories: CategoryOption[] = [
  { id: 'camera', name: 'Camera', icon: 'camera' },
  { id: 'laptop', name: 'Laptop', icon: 'laptop' },
  { id: 'phone', name: 'Phone', icon: 'phone-portrait' },
  { id: 'tablet', name: 'Tablet/iPad', icon: 'tablet-portrait' },
  { id: 'drone', name: 'Drone', icon: 'airplane' },
  { id: 'pc', name: 'PC', icon: 'desktop' },
  { id: 'gaming', name: 'Gaming', icon: 'game-controller' },
  { id: 'audio', name: 'Audio', icon: 'headset' },
];

const priceRanges = [
  { id: '0-50', label: '₱0 - ₱50' },
  { id: '51-100', label: '₱51 - ₱100' },
  { id: '101-200', label: '₱101 - ₱200' },
  { id: '201-500', label: '₱201 - ₱500' },
  { id: '500+', label: '₱500+' },
];

export default function PostItemScreen() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [condition, setCondition] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handlePostItem = () => {
    if (!itemName || !description || !price || !location || !selectedCategory) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    
    console.log('Posting item:', {
      itemName,
      description,
      price,
      location,
      category: selectedCategory,
      priceRange: selectedPriceRange,
      condition,
      images,
    });
    
    Alert.alert('Success', 'Your item has been posted successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleAddImage = () => {
    if (images.length >= 3) {
      Alert.alert('Maximum Images Reached', 'You can only upload up to 3 images.');
      return;
    }
    
    Alert.alert(
      'Add Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => pickImage('camera') },
        { text: 'Photo Library', onPress: () => pickImage('library') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const pickImage = async (source: 'camera' | 'library') => {
    try {
      const newImage = `https://picsum.photos/300/300?random=${Date.now()}`;
      setImages(prev => [...prev, newImage]);
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const renderCategoryItem = ({ item }: { item: CategoryOption }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemSelected,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <View style={styles.categoryIconContainer}>
        <Ionicons 
          name={item.icon} 
          size={14} 
          color={selectedCategory === item.id ? '#0066CC' : Colors.text.secondary} 
        />
      </View>
      <Text style={[
        styles.categoryName,
        selectedCategory === item.id && styles.categoryNameSelected,
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderPriceRangeItem = ({ item }: { item: { id: string; label: string } }) => (
    <TouchableOpacity
      style={[
        styles.priceRangeItem,
        selectedPriceRange === item.id && styles.priceRangeItemSelected,
      ]}
      onPress={() => setSelectedPriceRange(item.id)}
    >
      <Text style={[
        styles.priceRangeText,
        selectedPriceRange === item.id && styles.priceRangeTextSelected,
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Form Sections */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Item Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter item name"
              placeholderTextColor={Colors.text.tertiary}
              value={itemName}
              onChangeText={setItemName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Describe your item..."
              placeholderTextColor={Colors.text.tertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Price per Day (₱) *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="0"
              placeholderTextColor={Colors.text.tertiary}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your location"
              placeholderTextColor={Colors.text.tertiary}
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Category *</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
            ItemSeparatorComponent={() => <View style={{ width: Spacing.md }} />}
          />
        </View>

        {/* Price Range */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <FlatList
            data={priceRanges}
            renderItem={renderPriceRangeItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.priceRangeList}
            ItemSeparatorComponent={() => <View style={{ width: Spacing.md }} />}
          />
        </View>

        {/* Condition */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Condition</Text>
          <View style={styles.conditionButtons}>
            {['New', 'Like New', 'Good', 'Fair', 'Poor'].map((cond) => (
              <TouchableOpacity
                key={cond}
                style={[
                  styles.conditionButton,
                  condition === cond && styles.conditionButtonSelected,
                ]}
                onPress={() => setCondition(cond)}
              >
                <Text style={[
                  styles.conditionButtonText,
                  condition === cond && styles.conditionButtonTextSelected,
                ]}>
                  {cond}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Images */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Images</Text>
          <Text style={styles.imageSubtitle}>Upload up to 3 images ({images.length}/3)</Text>
          
          {/* Image Grid */}
          <View style={styles.imageGrid}>
            {/* Selected Images */}
            {images.map((image, index) => (
              <View key={index} style={styles.imageBox}>
                <Image source={{ uri: image }} style={styles.selectedImage} />
                <TouchableOpacity 
                  style={styles.removeImageButton} 
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={12} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
            
            {/* Empty Image Boxes */}
            {Array.from({ length: 3 - images.length }).map((_, index) => (
              <TouchableOpacity 
                key={`empty-${index}`} 
                style={styles.emptyImageBox} 
                onPress={handleAddImage}
              >
                <Ionicons name="add" size={14} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Post Button */}
        <View style={styles.postButtonContainer}>
          <TouchableOpacity style={styles.postButton} onPress={handlePostItem}>
            <Text style={styles.postButtonText}>Post Item</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  formSection: {
    marginBottom: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    fontWeight: '500',
  },
  textArea: {
    height: 120,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  categoriesList: {
    paddingBottom: 8,
  },
  categoryItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 90,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryItemSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#0066CC',
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  categoryIconContainer: {
    marginBottom: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryName: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  categoryNameSelected: {
    color: '#0066CC',
    fontWeight: '700',
  },
  priceRangeList: {
    paddingBottom: 8,
  },
  priceRangeItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  priceRangeItemSelected: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  priceRangeText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  priceRangeTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  conditionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  conditionButton: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  conditionButtonSelected: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  conditionButtonText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  conditionButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  imageSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    fontWeight: '500',
  },
  imageGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBox: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  emptyImageBox: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 2,
  },
  postButtonContainer: {
    paddingTop: 0,
    paddingBottom: 48,
  },
  postButton: {
    backgroundColor: '#0066CC',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#0066CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  postButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
