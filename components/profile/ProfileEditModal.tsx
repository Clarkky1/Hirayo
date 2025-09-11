import { Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileEditModal({ visible, onClose }: ProfileEditModalProps) {
  const { profile, updateProfile } = useUser();
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    surname: profile?.surname || '',
    email: profile?.email || '',
    phoneNumber: profile?.phoneNumber || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth) : null,
  });

  const [profileImage, setProfileImage] = useState<string | null>(profile?.profileImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    if (!formData.firstName.trim() || !formData.surname.trim() || !formData.email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!isValidEmail(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      updateProfile({
        ...formData,
        profileImage: profileImage || undefined,
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : undefined,
      });
      Alert.alert('Success', 'Profile updated successfully');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio for profile photos
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select your birth date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData(prev => ({ ...prev, dateOfBirth: selectedDate }));
    }
  };

  if (!profile) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Profile Image Section */}
            <View style={styles.imageSection}>
              <View style={styles.avatarContainer}>
                <TouchableOpacity style={styles.avatar} onPress={pickImage}>
                  {profileImage ? (
                    <Image 
                      source={{ uri: profileImage }} 
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.avatarText}>
                      {formData.firstName.split(' ').map(n => n[0]).join('')}
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.editImageButton} onPress={pickImage}>
                  <Ionicons name="camera" size={16} color={Colors.text.inverse} />
                </TouchableOpacity>
                {profileImage && (
                  <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                    <Ionicons name="close" size={12} color={Colors.text.inverse} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.imageHint}>Tap to change profile photo</Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formSection}>
              {/* Legal Name Section */}
              <View style={styles.sectionGroup}>
                <Text style={styles.sectionLabel}>Legal Name</Text>
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>First Name <Text style={styles.requiredAsterisk}>*</Text></Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="First name"
                        value={formData.firstName}
                        onChangeText={(value) => handleInputChange('firstName', value)}
                        autoCapitalize="words"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Surname <Text style={styles.requiredAsterisk}>*</Text></Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Surname"
                        value={formData.surname}
                        onChangeText={(value) => handleInputChange('surname', value)}
                        autoCapitalize="words"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Phone Number Section */}
              <View style={styles.sectionGroup}>
                <Text style={styles.sectionLabel}>Phone Number</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone <Text style={styles.requiredAsterisk}>*</Text></Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="09XXXXXXXXX"
                      value={formData.phoneNumber}
                      onChangeText={(value) => handleInputChange('phoneNumber', value)}
                      keyboardType="phone-pad"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              </View>

              {/* Date of Birth Section */}
              <View style={styles.sectionGroup}>
                <Text style={styles.sectionLabel}>Date of Birth</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Birth Date <Text style={styles.requiredAsterisk}>*</Text></Text>
                  <TouchableOpacity 
                    style={styles.inputWrapper}
                    onPress={showDatePickerModal}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="calendar-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <Text style={[styles.input, styles.dateInputText]}>
                      {formatDate(formData.dateOfBirth)}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Email Section */}
              <View style={styles.sectionGroup}>
                <Text style={styles.sectionLabel}>Email Address</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email <Text style={styles.requiredAsterisk}>*</Text></Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="your@email.com"
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              </View>

              {/* Location Section */}
              <View style={styles.sectionGroup}>
                <Text style={styles.sectionLabel}>Location</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Location</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="location-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your location"
                      value={formData.location}
                      onChangeText={(value) => handleInputChange('location', value)}
                      autoCapitalize="words"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              </View>

              {/* Bio Section */}
              <View style={styles.sectionGroup}>
                <Text style={styles.sectionLabel}>About You</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Bio</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.bio}
                    onChangeText={(value) => handleInputChange('bio', value)}
                    placeholder="Tell us about yourself"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    placeholderTextColor="#9CA3AF"
                  />
                  <Text style={styles.characterCount}>{formData.bio.length}/200</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.dateOfBirth || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  cancelButton: {
    padding: Spacing.xs,
  },
  cancelText: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
  },
  headerTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  saveButton: {
    padding: Spacing.xs,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveText: {
    ...TextStyles.body.medium,
    color: Colors.primary[500],
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.text.inverse,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background.primary,
  },
  removeImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background.primary,
  },
  imageHint: {
    ...TextStyles.caption,
    color: Colors.text.tertiary,
  },
  formSection: {
    gap: Spacing.lg,
  },
  sectionGroup: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: Spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: Spacing.sm,
  },
  requiredAsterisk: {
    color: '#EF4444',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 0,
  },
  dateInputText: {
    color: '#1F2937',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: Spacing.sm,
  },
  characterCount: {
    ...TextStyles.caption,
    color: Colors.text.tertiary,
    textAlign: 'right',
  },
});
