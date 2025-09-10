import { TermsConditionsModal } from '@/components/ui';
import { Shadows, Spacing } from '@/constants/DesignSystem';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  const [firstName, setFirstName] = useState('Kin Clark');
  const [surname, setSurname] = useState('Perez');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date(1990, 0, 1)); // January 1, 1990
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState('kinclark@gmail.com');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // ID Upload states
  const [idType, setIdType] = useState('');
  const [idImage, setIdImage] = useState<string | null>(null);
  const [showIdTypeModal, setShowIdTypeModal] = useState(false);

  const handleBack = () => {
    router.back();
  };

  // ID Type options
  const idTypes = [
    { id: 'government', label: 'Government ID', icon: 'card-outline' },
    { id: 'student', label: 'Student ID', icon: 'school-outline' },
    { id: 'passport', label: 'Passport', icon: 'airplane-outline' },
    { id: 'driver', label: 'Driver\'s License', icon: 'car-outline' },
  ];

  const handleIdTypeSelect = (type: string) => {
    setIdType(type);
    setShowIdTypeModal(false);
    // Automatically open image picker after selecting type
    handleImagePicker();
  };

  const handleImagePicker = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 10], // ID card aspect ratio
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIdImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleRemoveIdImage = () => {
    setIdImage(null);
    setIdType('');
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const handleAgreeAndContinue = () => {
    if (!termsAccepted) {
      setShowTermsModal(true);
      return;
    }
    
    // Handle form submission
    const userData = { 
      firstName, 
      surname, 
      phoneNumber,
      dateOfBirth: formatDate(dateOfBirth), 
      email 
    };
    console.log('Form submitted:', userData);
    // Use authentication hook to signup
    signup(userData);
    // Navigate to main app after successful signup
    router.replace('/(tabs)');
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setShowTermsModal(false);
    // Modal closes and checkbox gets checked, user can then click Signup button
  };

  const handleTermsDecline = () => {
    setShowTermsModal(false);
  };

  const isFormValid = firstName.trim() && surname.trim() && phoneNumber.trim() && dateOfBirth && email.trim() && termsAccepted;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: '#667EEA', height: 0 }} />
        {/* Background */}
        <View style={styles.backgroundContainer}>
          <View style={styles.gradientOverlay} />
          <View style={styles.floatingShapes}>
            <View style={[styles.shape, styles.shape1]} />
            <View style={[styles.shape, styles.shape2]} />
            <View style={[styles.shape, styles.shape3]} />
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
                <View style={styles.backButtonContainer}>
                  <Ionicons name="arrow-back" size={20} color="#667EEA" />
                </View>
              </TouchableOpacity>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Create your account</Text>
                <Text style={styles.headerSubtitle}>Join thousands of users on Hirayo</Text>
              </View>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              {/* ID Upload Section */}
              <View style={styles.formSection}>
                <Text style={styles.sectionLabel}>Identity Verification</Text>
                <Text style={styles.sectionSubtitle}>Upload a photo of your ID for verification</Text>
                
                {idImage ? (
                  <View style={styles.idImageContainer}>
                    <Image source={{ uri: idImage }} style={styles.idImage} />
                    <View style={styles.idImageOverlay}>
                      <Text style={styles.idTypeText}>
                        {idTypes.find(type => type.id === idType)?.label}
                      </Text>
                      <View style={styles.idImageActions}>
                        <TouchableOpacity 
                          style={styles.idActionButton}
                          onPress={handleImagePicker}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="camera-outline" size={16} color="#667EEA" />
                          <Text style={styles.idActionText}>Retake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.idActionButton}
                          onPress={handleRemoveIdImage}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="trash-outline" size={16} color="#EF4444" />
                          <Text style={[styles.idActionText, { color: '#EF4444' }]}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.idUploadButton}
                    onPress={() => setShowIdTypeModal(true)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="cloud-upload-outline" size={32} color="#9CA3AF" />
                    <Text style={styles.idUploadText}>Upload ID Photo</Text>
                    <Text style={styles.idUploadSubtext}>Tap to select ID type and upload</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Legal Name Section */}
              <View style={styles.formSection}>
                <Text style={styles.sectionLabel}>Legal Name</Text>
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>First Name <Text style={styles.requiredAsterisk}>*</Text></Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="First name on ID"
                        value={firstName}
                        onChangeText={setFirstName}
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
                        placeholder="Surname on ID"
                        value={surname}
                        onChangeText={setSurname}
                        autoCapitalize="words"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  </View>
                </View>
                <Text style={styles.helperText}>
                  Make sure this matches the name on your government-issued ID.
                </Text>
              </View>

              {/* Phone Number Section */}
              <View style={styles.formSection}>
                <Text style={styles.sectionLabel}>Phone Number</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone <Text style={styles.requiredAsterisk}>*</Text></Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="09XXXXXXXXX"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
                <Text style={styles.helperText}>
                  We'll use this to send you verification codes and important updates
                </Text>
              </View>

              {/* Date of Birth Section */}
              <View style={styles.formSection}>
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
                      {formatDate(dateOfBirth)}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.helperText}>
                  To sign up, you need to be at least 18. Other people who use Hirayo won't see your date of birth
                </Text>
              </View>

              {/* Email Section */}
              <View style={styles.formSection}>
                <Text style={styles.sectionLabel}>Email Address</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email <Text style={styles.requiredAsterisk}>*</Text></Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="your@email.com"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
                <Text style={styles.helperText}>
                  We'll email you a reservation confirmation
                </Text>
              </View>

              {/* Terms Agreement with Checkbox */}
              <View style={styles.agreementContainer}>
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setShowTermsModal(true)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                    {termsAccepted && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    I agree to Hirayo's{' '}
                    <Text style={styles.linkText}>Terms of Service</Text>
                    ,{' '}
                    <Text style={styles.linkText}>Payment Terms</Text>
                    {' '}and{' '}
                    <Text style={styles.linkText}>Anti-Discrimination Policy</Text>
                    , and acknowledge the{' '}
                    <Text style={styles.linkText}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Continue Button */}
              <TouchableOpacity 
                style={[
                  styles.primaryButton, 
                  isFormValid && styles.primaryButtonActive
                ]}
                onPress={handleAgreeAndContinue}
                disabled={!isFormValid}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Signup</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                  <Text style={styles.loginLink}>Log in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      
      <TermsConditionsModal
        visible={showTermsModal}
        onClose={handleTermsDecline}
        onAccept={handleTermsAccept}
      />
      
      {/* ID Type Selection Modal */}
      {showIdTypeModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select ID Type</Text>
              <TouchableOpacity 
                onPress={() => setShowIdTypeModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.idTypeList}>
              {idTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={styles.idTypeItem}
                  onPress={() => handleIdTypeSelect(type.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={type.icon as any} size={24} color="#667EEA" />
                  <Text style={styles.idTypeLabel}>{type.label}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
      
      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  
  // Modern Background
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: '#667EEA',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  floatingShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  shape: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
  },
  shape1: {
    width: 80,
    height: 80,
    top: 50,
    right: 20,
  },
  shape2: {
    width: 60,
    height: 60,
    top: 120,
    left: 30,
  },
  shape3: {
    width: 100,
    height: 100,
    top: 80,
    right: 60,
  },

  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing['2xl'],
  },

  // Modern Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing['2xl'],
  },
  backButton: {
    marginRight: Spacing.md,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
  },

  // Modern Form Card
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: Spacing['2xl'],
    ...Shadows.softLg,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },

  // Form Sections
  formSection: {
    marginBottom: Spacing['2xl'],
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: Spacing.sm,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: Spacing.lg,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
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
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginTop: Spacing.sm,
  },

  // Terms Agreement
  agreementContainer: {
    marginBottom: Spacing['2xl'],
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.lg,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    marginRight: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#667EEA',
    borderColor: '#667EEA',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  linkText: {
    color: '#667EEA',
    fontWeight: '600',
  },

  // Modern Primary Button
  primaryButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.softButton,
    marginBottom: Spacing.lg,
  },
  primaryButtonActive: {
    backgroundColor: '#667EEA',
    ...Shadows.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: Spacing.sm,
  },
  buttonIcon: {
    // Icon styles handled inline
  },

  // Modern Login Link
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667EEA',
  },

  // ID Upload Styles
  idUploadButton: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: Spacing['2xl'],
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  idUploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: Spacing.sm,
  },
  idUploadSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: Spacing.xs,
  },
  idImageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
  },
  idImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  idImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idTypeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  idImageActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  idActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    gap: Spacing.xs,
  },
  idActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },

  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    margin: Spacing.lg,
    maxHeight: '80%',
    width: '90%',
    ...Shadows.softLg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  modalCloseButton: {
    padding: Spacing.xs,
  },
  idTypeList: {
    padding: Spacing.lg,
  },
  idTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  idTypeLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  requiredAsterisk: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
});
