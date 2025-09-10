import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
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
import { Card } from '../../components/ui/Card';

LogBox.ignoreAllLogs(true);


interface EditableItem {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  location: string;
  status: 'active' | 'rented' | 'inactive';
  images?: string[]; // Added for image handling
}

export default function EditItemScreen() {
  const params = useLocalSearchParams();
  const itemId = params.itemId as string;
  const [item, setItem] = useState<EditableItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Mock data for demonstration - in real app this would come from API
  useEffect(() => {
    const mockItem: EditableItem = {
      id: itemId,
      name: 'Canon EOS R5 Camera',
      category: 'Cameras',
      price: '2500',
      description: 'Professional mirrorless camera with 45MP sensor and 4K video capabilities. Perfect for photography and videography.',
      location: 'Cebu City, Cebu',
      status: 'active',
      images: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
      ],
    };
    setItem(mockItem);
  }, [itemId]);

  const handleSave = () => {
    if (!item) return;
    
    if (!item.name || !item.category || !item.price || !item.description || !item.location) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    
    if (!item.images || item.images.length < 3) {
      Alert.alert('Insufficient Images', 'Please upload at least 3 images of your item.');
      return;
    }
    
    Alert.alert(
      'Save Changes',
      'Are you sure you want to save the changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Save', 
          onPress: () => {
            console.log('Saving item:', item);
            Alert.alert('Success', 'Item updated successfully!');
            router.back();
          }
        }
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { 
          text: 'Discard', 
          style: 'destructive',
          onPress: () => router.back()
        }
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            console.log('Deleting item:', itemId);
            Alert.alert('Success', 'Item deleted successfully!');
            router.back();
          }
        }
      ]
    );
  };

  const handleAddImage = () => {
    if (item && item.images && item.images.length < 5) {
      setItem({ ...item, images: [...item.images, 'https://via.placeholder.com/150'] });
    }
  };

  const handleRemoveImage = (index: number) => {
    if (item && item.images) {
      setItem({
        ...item,
        images: item.images.filter((_, i) => i !== index),
      });
    }
  };

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading item details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <Card variant="filled" padding="large" style={styles.sectionCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Item Name</Text>
              <TextInput
                style={styles.textInput}
                value={item.name}
                onChangeText={(text) => setItem({ ...item, name: text })}
                placeholder="Enter item name"
                placeholderTextColor={Colors.text.tertiary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <TextInput
                style={styles.textInput}
                value={item.category}
                onChangeText={(text) => setItem({ ...item, category: text })}
                placeholder="Enter category"
                placeholderTextColor={Colors.text.tertiary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Price (₱ per day)</Text>
              <TextInput
                style={styles.textInput}
                value={item.price}
                onChangeText={(text) => setItem({ ...item, price: text })}
                placeholder="Enter price"
                placeholderTextColor={Colors.text.tertiary}
                keyboardType="numeric"
              />
            </View>
          </Card>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Card variant="filled" padding="large" style={styles.sectionCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Item Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={item.description}
                onChangeText={(text) => setItem({ ...item, description: text })}
                placeholder="Describe your item in detail..."
                placeholderTextColor={Colors.text.tertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </Card>
        </View>

        {/* Location & Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location & Status</Text>
          <Card variant="filled" padding="large" style={styles.sectionCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.textInput}
                value={item.location}
                onChangeText={(text) => setItem({ ...item, location: text })}
                placeholder="Enter location"
                placeholderTextColor={Colors.text.tertiary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Status</Text>
              <View style={styles.statusSelector}>
                {(['active', 'inactive'] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusOption,
                      item.status === status && styles.statusOptionActive
                    ]}
                    onPress={() => setItem({ ...item, status })}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.statusOptionText,
                      item.status === status && styles.statusOptionTextActive
                    ]}>
                      {status === 'active' ? 'Available' : 'Not Available'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Card>
        </View>

        {/* Photos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos *</Text>
          <Text style={styles.photoSubtitle}>
            Upload at least 3 images, maximum 5 images ({item.images?.length || 0}/5)
          </Text>
          
          <Card variant="filled" padding="large" style={styles.sectionCard}>
            <View style={styles.photoSection}>
              {/* Image Grid */}
              <View style={styles.imageGrid}>
                {/* Existing Images */}
                {(item.images || []).map((image, index) => (
                  <View key={index} style={styles.imageBox}>
                    <Image source={{ uri: image }} style={styles.selectedImage} />
                    <TouchableOpacity 
                      style={styles.removeImageButton} 
                      onPress={() => handleRemoveImage(index)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close-circle" size={16} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
                
                {/* Empty Image Boxes */}
                {Array.from({ length: 5 - (item.images?.length || 0) }).map((_, index) => (
                  <TouchableOpacity 
                    key={`empty-${index}`} 
                    style={styles.emptyImageBox} 
                    onPress={handleAddImage}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add" size={24} color={Colors.neutral[400]} />
                    <Text style={styles.addImageText}>Add</Text>
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
            </View>
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButton]} 
              onPress={handleSave}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark" size={20} color={Colors.text.inverse} />
              <Text style={styles.actionButtonText}>Save Changes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]} 
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={Colors.text.inverse} />
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delete Section */}
        <View style={styles.deleteSection}>
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Ionicons name="trash" size={20} color={Colors.error} />
            <Text style={styles.deleteButtonText}>Delete Item</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  sectionCard: {
    // Card component handles styling
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.base,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.background.secondary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  statusSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statusOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: Colors.border.light,
    alignItems: 'center',
  },
  statusOptionActive: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  statusOptionText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  statusOptionTextActive: {
    color: Colors.text.inverse,
  },
  photoSection: {
    alignItems: 'center',
  },
  photoSubtitle: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: Spacing.md,
  },
  imageBox: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: Colors.border.light,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
    zIndex: 1,
  },
  emptyImageBox: {
    width: 100,
    height: 100,
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.base,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderStyle: 'dashed',
  },
  addImageText: {
    ...TextStyles.body.small,
    color: Colors.neutral[400],
    marginTop: Spacing.xs,
  },
  imageRequirements: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.base,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  imageRequirementsText: {
    ...TextStyles.body.small,
    color: Colors.warning,
    marginLeft: Spacing.sm,
  },
  actionsSection: {
    marginBottom: Spacing.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.base,
  },
  saveButton: {
    backgroundColor: Colors.success,
  },
  cancelButton: {
    backgroundColor: '#FF9500', // Changed to orange
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  actionButtonText: {
    ...TextStyles.button.medium,
    color: Colors.text.inverse,
    marginLeft: Spacing.sm,
  },
  cancelButtonText: {
    color: Colors.text.primary,
  },
  deleteSection: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  deleteButtonText: {
    ...TextStyles.button.medium,
    color: Colors.error,
    marginLeft: Spacing.sm,
  },
});
