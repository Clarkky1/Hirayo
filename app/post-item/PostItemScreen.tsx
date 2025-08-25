import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
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
import { Card } from '../../components/ui/Card';

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
          color={selectedCategory === item.id ? Colors.primary[500] : Colors.text.secondary} 
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
        <Card variant="filled" padding="large" style={styles.formSection}>
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
        </Card>

        {/* Category Selection */}
        <Card variant="filled" padding="large" style={styles.formSection}>
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
        </Card>

        {/* Price Range */}
        <Card variant="filled" padding="large" style={styles.formSection}>
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
        </Card>

        {/* Condition */}
        <Card variant="filled" padding="large" style={styles.formSection}>
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
        </Card>

        {/* Images */}
        <Card variant="filled" padding="large" style={styles.formSection}>
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
                  <Ionicons name="close-circle" size={12} color={Colors.error} />
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
                <Ionicons name="add" size={14} color={Colors.neutral[400]} />
              </TouchableOpacity>
            ))}
          </View>
        </Card>

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
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  formSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  textArea: {
    height: 120,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  categoryItem: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    minWidth: 90,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  categoryItemSelected: {
    backgroundColor: Colors.primary[100],
    borderColor: Colors.primary[500],
  },
  categoryIconContainer: {
    marginBottom: Spacing.xs,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  categoryNameSelected: {
    color: Colors.primary[500],
    fontWeight: '700',
  },
  priceRangeList: {
    paddingBottom: 8,
  },
  priceRangeItem: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  priceRangeItemSelected: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  priceRangeText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  priceRangeTextSelected: {
    color: Colors.text.inverse,
    fontWeight: '700',
  },
  conditionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  conditionButton: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  conditionButtonSelected: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  conditionButtonText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  conditionButtonTextSelected: {
    color: Colors.text.inverse,
    fontWeight: '700',
  },
  imageSubtitle: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    fontWeight: '500',
  },
  imageGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
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
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border.light,
  },
  emptyImageBox: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border.medium,
    borderStyle: 'dashed',
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.background.primary,
    borderRadius: 10,
    padding: 2,
  },
  postButtonContainer: {
    paddingTop: 0,
    paddingBottom: Spacing.xl * 2,
  },
  postButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  postButtonText: {
    ...TextStyles.button.large,
    color: Colors.text.inverse,
    fontWeight: '700',
  },
});
