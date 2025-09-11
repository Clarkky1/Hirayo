import { Shadows, Spacing } from '@/constants/DesignSystem';
import { useAuthState } from '@/contexts/AuthStateContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import OTPVerificationScreen from './OTPVerificationScreen'; // Commented out for email/password login

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { signInWithPhone, verifyOtp, signInWithEmail } = useSupabaseAuth();
  const { setAuthenticated } = useAuthState();
  // Phone number login - commented out temporarily
  // const [phoneNumber, setPhoneNumber] = useState('');
  // const [showOTP, setShowOTP] = useState(false);
  
  // Email/Password login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Phone number validation for Philippine numbers (11 digits starting with 09) - commented out
  // const isValidPhoneNumber = (phone: string) => {
  //   const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
  //   // Philippine mobile numbers: 11 digits starting with 09
  //   return cleanPhone.length === 11 && cleanPhone.startsWith('09');
  // };

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };



  // Phone number login - commented out temporarily
  // const handleContinue = async () => {
  //   if (!isValidPhoneNumber(phoneNumber)) return;
  //   
  //   setIsLoading(true);
  //   try {
  //     console.log('Sending OTP to:', phoneNumber);
  //     
  //     // For now, simulate OTP sending since phone auth needs SMS provider setup
  //     await new Promise(resolve => setTimeout(resolve, 1500));
  //     
  //     // Show OTP verification screen
  //     setShowOTP(true);
  //   } catch (error) {
  //     console.error('Send OTP error:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      console.log('Facebook login');
      // Use authentication hook to login
      await login({ provider: 'facebook' });
      
      // Set authenticated state
      await setAuthenticated(true);
      
      // Add a small delay to ensure smooth transition
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Navigate to main app after successful login
      router.push('/(tabs)');
    } catch (error) {
      console.error('Facebook login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      console.log('Google login');
      // Use authentication hook to login
      await login({ provider: 'google' });
      
      // Set authenticated state
      await setAuthenticated(true);
      
      // Add a small delay to ensure smooth transition
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Navigate to main app after successful login
      router.push('/(tabs)');
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    try {
      // Validate email format
      if (!isValidEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      // Validate password
      if (!password.trim()) {
        Alert.alert('Error', 'Please enter your password');
        return;
      }

      setIsLoading(true);

      // Sign in with Supabase
      const { error } = await signInWithEmail(email.trim(), password);
      
      if (error) {
        console.error('Login error:', error);
        Alert.alert('Login Failed', error.message || 'Invalid email or password. Please try again.');
        return;
      }

      // Success
      await setAuthenticated(true);
      
      // Add a small delay to ensure smooth transition
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Navigate to main app after successful login
      router.replace('/(tabs)');

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      // Validate email format
      if (!isValidEmail(resetEmail)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      setIsResetting(true);

      // Send password reset email using Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: 'https://google.com',
      });

      if (error) {
        console.error('Password reset error:', error);
        Alert.alert('Error', error.message || 'Failed to send reset email. Please try again.');
        return;
      }

      // Success
      Alert.alert(
        'Reset Email Sent',
        'Please check your email for password reset instructions.',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowForgotPassword(false);
              setResetEmail('');
            }
          }
        ]
      );

    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  // OTP verification - commented out temporarily
  // const handleBackFromOTP = () => {
  //   setShowOTP(false);
  // };

  // Show OTP verification screen if OTP step is active - commented out
  // if (showOTP) {
  //   return (
  //     <OTPVerificationScreen 
  //       phoneNumber={phoneNumber} 
  //       onBack={handleBackFromOTP} 
  //     />
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: '#667EEA', height: 0 }} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Background with Gradient Effect */}
        <View style={styles.backgroundContainer}>
          <View style={styles.gradientOverlay} />
          <View style={styles.floatingShapes}>
            <View style={[styles.shape, styles.shape1]} />
            <View style={[styles.shape, styles.shape2]} />
            <View style={[styles.shape, styles.shape3]} />
          </View>
        </View>
        
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('@/assets/splash/h-logo.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appName}>Hirayo</Text>
            <Text style={styles.tagline}>Rent anything, anywhere</Text>
          </View>

          {/* Card Container */}
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.welcomeText}>Welcome back!</Text>
                <Text style={styles.subtitleText}>Sign in to continue your journey</Text>
              </View>

              {/* Input Section */}
              <View style={styles.inputSection}>
                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={[
                    styles.inputWrapper,
                    styles.inputWrapperFocused
                  ]}>
                    <Ionicons 
                      name="mail-outline" 
                      size={20} 
                      color="#9CA3AF" 
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.inputField}
                      placeholder="Enter your email"
                      placeholderTextColor="#9CA3AF"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCorrect={false}
                      autoCapitalize="none"
                      returnKeyType="next"
                      editable={true}
                      selectTextOnFocus={false}
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={[
                    styles.inputWrapper,
                    styles.inputWrapperFocused
                  ]}>
                    <Ionicons 
                      name="lock-closed-outline" 
                      size={20} 
                      color="#9CA3AF" 
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.inputField}
                      placeholder="Enter your password"
                      placeholderTextColor="#9CA3AF"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCorrect={false}
                      autoCapitalize="none"
                      returnKeyType="done"
                      editable={true}
                      selectTextOnFocus={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                      activeOpacity={0.7}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={20} 
                        color="#9CA3AF" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Phone number login - commented out temporarily */}
                {/* <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <View style={[
                    styles.inputWrapper,
                    styles.inputWrapperFocused
                  ]}>
                    <Ionicons 
                      name="call-outline" 
                      size={20} 
                      color="#9CA3AF" 
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.inputField}
                      placeholder="09XXXXXXXXX"
                      placeholderTextColor="#9CA3AF"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      autoCorrect={false}
                      autoCapitalize="none"
                      returnKeyType="done"
                      editable={true}
                      selectTextOnFocus={false}
                    />
                  </View>
                </View>

                <Text style={styles.termsText}>
                  We'll send you a 6-digit verification code via SMS. Standard message rates apply.
                </Text>

                {phoneNumber.length > 0 && !isValidPhoneNumber(phoneNumber) && (
                  <Text style={styles.errorText}>
                    Please enter a valid phone number (09XXXXXXXXX)
                  </Text>
                )} */}

                {/* Forgot Password Link */}
                <TouchableOpacity 
                  style={styles.forgotPasswordContainer}
                  onPress={() => setShowForgotPassword(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.primaryButton, 
                    isValidEmail(email) && password.trim() && styles.primaryButtonActive,
                    isLoading && styles.primaryButtonLoading
                  ]}
                  onPress={handleEmailLogin}
                  disabled={!isValidEmail(email) || !password.trim() || isLoading}
                  activeOpacity={0.8}
                >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <View style={styles.loadingSpinner} />
                    <Text style={styles.primaryButtonText}>Logging in...</Text>
                  </View>
                ) : (
                  <Text style={styles.primaryButtonText}>Log in</Text>
                )}
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Buttons */}
              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.socialButton, styles.facebookButton]} 
                  onPress={handleFacebookLogin} 
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-facebook" size={20} color="#FFFFFF" />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.socialButton, styles.googleButton]} 
                  onPress={handleGoogleLogin} 
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                  <Text style={[styles.socialButtonText, styles.googleButtonText]}>Google</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>New to Hirayo? </Text>
              <TouchableOpacity onPress={handleSignup} activeOpacity={0.7}>
                <Text style={styles.signupLink}>Create account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reset Password</Text>
              <TouchableOpacity 
                onPress={() => setShowForgotPassword(false)}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalDescription}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>
            
            <View style={styles.modalInputGroup}>
              <Text style={styles.modalInputLabel}>Email Address</Text>
              <View style={styles.modalInputWrapper}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color="#9CA3AF" 
                  style={styles.modalInputIcon}
                />
                <TextInput
                  style={styles.modalInputField}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoCapitalize="none"
                  returnKeyType="done"
                />
              </View>
            </View>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowForgotPassword(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.modalSubmitButton,
                  !isValidEmail(resetEmail) && styles.modalSubmitButtonDisabled
                ]}
                onPress={handleForgotPassword}
                disabled={!isValidEmail(resetEmail) || isResetting}
                activeOpacity={0.8}
              >
                {isResetting ? (
                  <View style={styles.modalLoadingContainer}>
                    <View style={styles.modalLoadingSpinner} />
                    <Text style={styles.modalSubmitButtonText}>Sending...</Text>
                  </View>
                ) : (
                  <Text style={styles.modalSubmitButtonText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    height: height * 0.6,
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
    width: 100,
    height: 100,
    top: 100,
    right: 30,
  },
  shape2: {
    width: 60,
    height: 60,
    top: 200,
    left: 20,
  },
  shape3: {
    width: 80,
    height: 80,
    top: 300,
    right: 60,
  },

  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing['6xl']*3,
    paddingBottom: Spacing.sm,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoContainer: {
    marginBottom: Spacing.sm,
  },
  logo: {
    width: 40,
    height: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '400',
  },

  // Modern Card
  cardContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    ...Shadows.softLg,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: Spacing.xs,
  },
  subtitleText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Modern Input Section
  inputSection: {
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
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
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
    minHeight: 44,
  },
  inputWrapperFocused: {
    borderColor: '#667EEA',
    backgroundColor: '#FFFFFF',
    ...Shadows.softBase,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  eyeIcon: {
    padding: 4,
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    paddingVertical: 0,
    height: 40,
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
    lineHeight: 18,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 18,
  },

  // Modern Primary Button
  primaryButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...Shadows.softButton,
  },
  primaryButtonActive: {
    backgroundColor: '#667EEA',
    ...Shadows.primary,
  },
  primaryButtonLoading: {
    backgroundColor: '#5A67D8',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderTopColor: 'transparent',
    marginRight: Spacing.sm,
  },

  // Modern Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: Spacing.lg,
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  // Modern Social Buttons
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing['2xl'],
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: Spacing.lg,
    marginHorizontal: Spacing.xs,
    ...Shadows.softSm,
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: Spacing.sm,
    color: '#FFFFFF',
  },
  googleButtonText: {
    color: '#374151',
  },

  // Modern Sign Up
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  signupText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667EEA',
  },

  // Forgot Password Styles
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#667EEA',
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
    borderRadius: 16,
    padding: Spacing.xl,
    marginHorizontal: Spacing.lg,
    width: '90%',
    maxWidth: 400,
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  modalInputGroup: {
    marginBottom: Spacing.xl,
  },
  modalInputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: Spacing.sm,
  },
  modalInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  modalInputIcon: {
    marginRight: Spacing.sm,
  },
  modalInputField: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  modalSubmitButton: {
    flex: 1,
    backgroundColor: '#667EEA',
    borderRadius: 12,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  modalSubmitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  modalSubmitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalLoadingSpinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderTopColor: 'transparent',
    marginRight: Spacing.sm,
  },
});
