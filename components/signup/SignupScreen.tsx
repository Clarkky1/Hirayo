import { TermsConditionsModal } from '@/components/ui';
import { Shadows, Spacing } from '@/constants/DesignSystem';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
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
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('kinclark@gmail.com');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleAgreeAndContinue = () => {
    if (!termsAccepted) {
      setShowTermsModal(true);
      return;
    }
    
    // Handle form submission
    const userData = { firstName, surname, dateOfBirth, email };
    console.log('Form submitted:', userData);
    // Use authentication hook to signup
    signup(userData);
    // Navigate to main app after successful signup
    router.replace('/(tabs)');
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setShowTermsModal(false);
    
    // Proceed with registration after accepting terms
    const userData = { firstName, surname, dateOfBirth, email };
    console.log('Form submitted:', userData);
    signup(userData);
    router.replace('/(tabs)');
  };

  const handleTermsDecline = () => {
    setShowTermsModal(false);
  };

  const isFormValid = firstName.trim() && surname.trim() && dateOfBirth.trim() && email.trim();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Background */}
        <View style={styles.backgroundContainer}>
          <View style={styles.gradientOverlay} />
          <View style={styles.floatingShapes}>
            <View style={[styles.shape, styles.shape1]} />
            <View style={[styles.shape, styles.shape2]} />
            <View style={[styles.shape, styles.shape3]} />
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
              {/* Legal Name Section */}
              <View style={styles.formSection}>
                <Text style={styles.sectionLabel}>Legal Name</Text>
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>First Name</Text>
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
                    <Text style={styles.inputLabel}>Surname</Text>
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

              {/* Date of Birth Section */}
              <View style={styles.formSection}>
                <Text style={styles.sectionLabel}>Date of Birth</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Birth Date</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="calendar-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="MM/DD/YYYY"
                      value={dateOfBirth}
                      onChangeText={setDateOfBirth}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
                <Text style={styles.helperText}>
                  To sign up, you need to be at least 18. Other people who use Hirayo won't see your date of birth
                </Text>
              </View>

              {/* Email Section */}
              <View style={styles.formSection}>
                <Text style={styles.sectionLabel}>Email Address</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
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

              {/* Terms Agreement */}
              <View style={styles.agreementContainer}>
                <Text style={styles.agreementText}>
                  By selecting{' '}
                  <Text style={styles.linkText}>Agree and continue</Text>
                  , I agree to Hirayo's{' '}
                  <Text style={styles.linkText} onPress={() => setShowTermsModal(true)}>Terms of Service</Text>
                  ,{' '}
                  <Text style={styles.linkText} onPress={() => setShowTermsModal(true)}>Payment Terms</Text>
                  {' '}and{' '}
                  <Text style={styles.linkText} onPress={() => setShowTermsModal(true)}>Anti-Discrimination Policy</Text>
                  , and acknowledge the{' '}
                  <Text style={styles.linkText} onPress={() => setShowTermsModal(true)}>Privacy Policy</Text>
                  .
                </Text>
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
                <Text style={styles.primaryButtonText}>Agree and continue</Text>
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
      </KeyboardAvoidingView>
      
      <TermsConditionsModal
        visible={showTermsModal}
        onClose={handleTermsDecline}
        onAccept={handleTermsAccept}
      />
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
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginTop: Spacing.sm,
  },

  // Terms Agreement
  agreementContainer: {
    marginBottom: Spacing['2xl'],
    padding: Spacing.lg,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  agreementText: {
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
});
