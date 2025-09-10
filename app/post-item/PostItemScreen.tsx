import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    LogBox,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Card } from '../../components/ui/Card';

LogBox.ignoreAllLogs(true);


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
    
    if (images.length < 3) {
      Alert.alert('Insufficient Images', 'Please upload at least 3 images of your item.');
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
    if (images.length >= 5) {
      Alert.alert('Maximum Images Reached', 'You can only upload up to 5 images.');
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
      // Simulate image picker
      const newImage = `https://picsum.photos/300/300?random=${Date.now()}`;
      setImages(prev => [...prev, newImage]);
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = (index: number) => {
    if (images.length <= 3) {
      Alert.alert('Minimum Images Required', 'You must have at least 3 images. Cannot remove more images.');
      return;
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const renderCategoryItem = ({ item }: { item: CategoryOption }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemSelected,
      ]}
      onPress={() => setSelectedCategory(item.id)}
      activeOpacity={0.7}
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
      activeOpacity={0.7}
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
        <Card variant="filled" padding="medium" style={styles.formSection}>
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
        <Card variant="filled" padding="medium" style={styles.formSection}>
          <Text style={styles.sectionTitle}>Category *</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
            ItemSeparatorComponent={() => <View style={{ width: Spacing.sm }} />}
          />
        </Card>

        {/* Price Range */}
        <Card variant="filled" padding="medium" style={styles.formSection}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <FlatList
            data={priceRanges}
            renderItem={renderPriceRangeItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.priceRangeList}
            ItemSeparatorComponent={() => <View style={{ width: Spacing.sm }} />}
          />
        </Card>

        {/* Condition */}
        <Card variant="filled" padding="medium" style={styles.formSection}>
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
                activeOpacity={0.7}
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
        <Card variant="filled" padding="medium" style={styles.formSection}>
          <Text style={styles.sectionTitle}>Images *</Text>
          <Text style={styles.imageSubtitle}>
            Upload at least 3 images, maximum 5 images ({images.length}/5)
          </Text>
          
          {/* Image Grid */}
          <View style={styles.imageGrid}>
            {/* Selected Images */}
            {images.map((image, index) => (
              <View key={index} style={styles.imageBox}>
                <Image source={{ uri: image }} style={styles.selectedImage} />
                <TouchableOpacity 
                  style={styles.removeImageButton} 
                  onPress={() => removeImage(index)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle" size={12} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ))}
            
            {/* Empty Image Boxes */}
            {Array.from({ length: 5 - images.length }).map((_, index) => (
              <TouchableOpacity 
                key={`empty-${index}`} 
                style={styles.emptyImageBox} 
                onPress={handleAddImage}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={14} color={Colors.neutral[400]} />
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Image Requirements Notice */}
          <View style={styles.imageRequirements}>
            <Ionicons name="information-circle" size={16} color={Colors.warning} />
            <Text style={styles.imageRequirementsText}>
              Minimum 3 images required. High-quality images help attract more renters.
            </Text>
          </View>
        </Card>

        {/* Post Button */}
        <View style={styles.postButtonContainer}>
          <TouchableOpacity style={styles.postButton} onPress={handlePostItem} activeOpacity={0.7}>
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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  formSection: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  inputGroup: {
    marginBottom: Spacing.sm,
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
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  categoryItem: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  categoryItemSelected: {
    backgroundColor: Colors.primary[100],
    borderColor: Colors.primary[500],
  },
  categoryIconContainer: {
    marginBottom: Spacing.xs,
    width: 32,
    height: 32,
    borderRadius: 16,
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
    paddingBottom: Spacing.xs,
  },
  priceRangeItem: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
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
    gap: Spacing.sm,
  },
  conditionButton: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
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
    marginBottom: Spacing.xs,
    fontWeight: '500',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
    justifyContent: 'space-between',
  },
  imageBox: {
    position: 'relative',
    width: '48%',
    aspectRatio: 1,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: Colors.border.light,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyImageBox: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.base,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border.light,
    borderStyle: 'dashed',
    marginBottom: Spacing.xs,
  },
  removeImageButton: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.full,
    padding: 2,
  },
  imageRequirements: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  imageRequirementsText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
    flexShrink: 1,
  },
  postButtonContainer: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  postButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  postButtonText: {
    ...TextStyles.button.large,
    color: Colors.text.inverse,
    fontWeight: '700',
  },
});
