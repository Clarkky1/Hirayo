import { Colors, Shadows, Spacing } from '@/constants/DesignSystem';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { itemsService } from '@/services/itemsService';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SkeletonLoader from '../common/SkeletonLoader';

const PostItemScreen = () => {
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    location: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleInputFocus = (inputName: string) => {
    // Scroll to the focused input after a short delay to ensure keyboard is open
    setTimeout(() => {
      if (scrollViewRef.current) {
        // Scroll to show the input and some space below it
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 300);
  };

  const categories = [
    'laptop', 'camera', 'phone', 'drone', 'gaming', 'audio', 
    'tablet/ipad', 'pc'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter item name');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter item description');
      return false;
    }
    if (!formData.price.trim() || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }
    if (!formData.category) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }
    if (!formData.location.trim()) {
      Alert.alert('Error', 'Please enter location');
      return false;
    }
    if (images.length === 0) {
      Alert.alert('Error', 'Please add at least one image');
      return false;
    }
    return true;
  };

  const handlePostItem = async () => {
    if (!validateForm() || !user) return;

    setLoading(true);
    try {
      // Test network connectivity first
      console.log('Testing network connectivity...');
      const networkTest = await itemsService.testNetworkConnectivity();
      if (!networkTest.success) {
        throw new Error(`Network connectivity failed: ${networkTest.error}. Please check your internet connection.`);
      }
      console.log('Network connectivity: OK');

      // Test upload functionality directly (skip bucket listing)
      console.log('Testing upload functionality...');
      const uploadTest = await itemsService.testUpload();
      if (!uploadTest.success) {
        console.warn('Upload test failed, but continuing with actual upload...');
        console.warn('Upload test error:', uploadTest.error);
      } else {
        console.log('Upload test successful');
      }

      // Upload images first
      const uploadedImageUrls: string[] = [];
      for (const imageUri of images) {
        console.log('Uploading image:', imageUri);
        try {
          const url = await itemsService.uploadItemImage(imageUri, user.id);
          uploadedImageUrls.push(url);
          console.log('Image uploaded successfully:', url);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          
          // If upload fails due to network issues, use the local URI as fallback
          if (uploadError instanceof Error && uploadError.message.includes('Network request failed')) {
            console.warn('Using local image URI as fallback due to network issues');
            uploadedImageUrls.push(imageUri);
          } else {
            throw uploadError;
          }
        }
      }

      // Create item
      const itemData = {
        lender_id: user.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price_per_day: Number(formData.price),
        category: formData.category,
        location: formData.location.trim(),
        images: uploadedImageUrls,
        rating: 0.0,
        is_available: true,
      };

      const { data, error } = await itemsService.createItem(itemData);
      
      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Item posted successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error posting item:', error);
      
      let errorMessage = 'Failed to post item. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Storage connection failed')) {
          errorMessage = 'Storage connection failed. Please check your internet connection and try again.';
        } else if (error.message.includes('Failed to fetch image')) {
          errorMessage = 'Failed to process the selected image. Please try selecting a different image.';
        } else if (error.message.includes('not found') || error.message.includes('does not exist')) {
          errorMessage = 'Storage bucket not found. Please contact support.';
        } else if (error.message.includes('permission denied') || error.message.includes('unauthorized')) {
          errorMessage = 'Permission denied. Please make sure you are logged in and try again.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Images Section - Prominent */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Photos</Text>
              <Text style={styles.sectionSubtitle}>Add up to 5 photos</Text>
            </View>
            
            <View style={styles.imageGrid}>
              {loading ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <SkeletonLoader
                    key={index}
                    width={100}
                    height={100}
                    borderRadius={12}
                    style={styles.imageSkeleton}
                  />
                ))
              ) : (
                <>
                  {images.map((image, index) => (
                    <View key={index} style={styles.imageCard}>
                      <Image source={{ uri: image }} style={styles.image} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <Ionicons name="close-circle" size={20} color={Colors.error} />
                      </TouchableOpacity>
                    </View>
                  ))}
                  
                  {images.length < 5 && (
                    <TouchableOpacity style={styles.addImageCard} onPress={pickImage}>
                      <Ionicons name="camera" size={28} color={Colors.primary[500]} />
                      <Text style={styles.addImageText}>Add Photo</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          </View>

          {/* Item Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Item Details</Text>
            </View>

            {/* Item Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Item Name <Text style={styles.requiredAsterisk}>*</Text></Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="What are you renting out?"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  onFocus={() => handleInputFocus('name')}
                  placeholderTextColor={Colors.text.secondary}
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description <Text style={styles.requiredAsterisk}>*</Text></Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your item, its condition, and what makes it special..."
                  value={formData.description}
                  onChangeText={(value) => handleInputChange('description', value)}
                  onFocus={() => handleInputFocus('description')}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor={Colors.text.secondary}
                />
              </View>
            </View>

            {/* Price and Category Row */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Daily Rate <Text style={styles.requiredAsterisk}>*</Text></Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.currencySymbol}>₱</Text>
                  <TextInput
                    style={[styles.input, styles.priceInput]}
                    placeholder="0.00"
                    value={formData.price}
                    onChangeText={(value) => handleInputChange('price', value)}
                    onFocus={() => handleInputFocus('price')}
                    keyboardType="numeric"
                    placeholderTextColor={Colors.text.secondary}
                  />
                </View>
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Category *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        formData.category === category && styles.categoryChipSelected
                      ]}
                      onPress={() => handleInputChange('category', category)}
                    >
                      <Text style={[
                        styles.categoryText,
                        formData.category === category && styles.categoryTextSelected
                      ]}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Location */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color={Colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  placeholder="Province/City/Barangay"
                  value={formData.location}
                  onChangeText={(value) => handleInputChange('location', value)}
                  onFocus={() => handleInputFocus('location')}
                  placeholderTextColor={Colors.text.secondary}
                />
              </View>
            </View>

            {/* Post Button - Part of scrollable content */}
            <View style={styles.postButtonContainer}>
              <TouchableOpacity
                style={[styles.postButton, loading && styles.postButtonDisabled]}
                onPress={handlePostItem}
                disabled={loading}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <View style={styles.loadingSpinner} />
                    <Text style={styles.postButtonText}>Posting...</Text>
                  </View>
                ) : (
                  <>
                    <Ionicons name="add-circle" size={20} color={Colors.text.inverse} />
                    <Text style={styles.postButtonText}>Post Item</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  // Modern Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    ...Shadows.sm,
  },
  backButton: {
    padding: Spacing.sm,
    marginRight: Spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  // Section Styling
  section: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    padding: Spacing.lg,
    marginVertical: Spacing.sm,
    ...Shadows.sm,
  },
  sectionHeader: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  // Form Styling
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  requiredAsterisk: {
    color: Colors.error,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: '#FAFAFA',
  },
  inputWithIcon: {
    paddingLeft: 40,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  currencySymbol: {
    position: 'absolute',
    left: 12,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    zIndex: 1,
  },
  priceInput: {
    paddingLeft: 30,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  // Category Chips
  categoryScroll: {
    marginTop: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: Spacing.sm,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  categoryText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  // Image Grid
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  imageSkeleton: {
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  imageCard: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.background.primary,
    borderRadius: 12,
    padding: 2,
    ...Shadows.sm,
  },
  addImageCard: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary[500],
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
  },
  addImageText: {
    fontSize: 12,
    color: Colors.primary[500],
    marginTop: Spacing.xs,
    fontWeight: '500',
  },
  // Post Button Container
  postButtonContainer: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  postButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: 16,
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  postButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  postButtonText: {
    fontSize: 16,
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  loadingSpinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.text.inverse,
    borderTopColor: 'transparent',
  },
});

export default PostItemScreen;
