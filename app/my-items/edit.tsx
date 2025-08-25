import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Card } from '../../components/ui/Card';

interface EditableItem {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  location: string;
  status: 'active' | 'rented' | 'inactive';
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
    };
    setItem(mockItem);
  }, [itemId]);

  const handleSave = () => {
    if (item) {
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
    }
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
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Edit Item</Text>
          <Text style={styles.headerSubtitle}>Update your item information</Text>
        </View>

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
          <Text style={styles.sectionTitle}>Photos</Text>
          <Card variant="filled" padding="large" style={styles.sectionCard}>
            <View style={styles.photoSection}>
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera" size={32} color={Colors.neutral[400]} />
                <Text style={styles.photoPlaceholderText}>Add Photos</Text>
              </View>
              <TouchableOpacity style={styles.addPhotoButton}>
                <Ionicons name="add" size={20} color={Colors.primary[500]} />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.saveButton]} 
              onPress={handleSave}
            >
              <Ionicons name="checkmark" size={20} color={Colors.text.inverse} />
              <Text style={styles.actionButtonText}>Save Changes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]} 
              onPress={handleCancel}
            >
              <Ionicons name="close" size={20} color={Colors.text.primary} />
              <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delete Section */}
        <View style={styles.deleteSection}>
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={handleDelete}
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
  headerSection: {
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    ...TextStyles.heading.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
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
  photoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border.light,
    borderStyle: 'dashed',
  },
  photoPlaceholderText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: Colors.primary[500],
  },
  addPhotoText: {
    ...TextStyles.body.small,
    color: Colors.primary[500],
    marginLeft: Spacing.xs,
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
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.light,
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
