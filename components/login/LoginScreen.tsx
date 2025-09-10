import { Shadows, Spacing } from '@/constants/DesignSystem';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
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

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Phone number validation for Philippine numbers (11 digits starting with 09)
  const isValidPhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
    // Philippine mobile numbers: 11 digits starting with 09
    return cleanPhone.length === 11 && cleanPhone.startsWith('09');
  };



  const handleContinue = async () => {
    if (!isValidPhoneNumber(phoneNumber)) return;
    
    setIsLoading(true);
    try {
      console.log('Continue with:', phoneNumber);
      // Use authentication hook to login
      await login({ phoneNumber });
      
      // Add a small delay to ensure smooth transition
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Navigate to main app after successful login
      router.push('/(tabs)');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      console.log('Facebook login');
      // Use authentication hook to login
      await login({ provider: 'facebook' });
      
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

  const handleSignup = () => {
    router.push('/signup');
  };

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
              <View style={styles.logoBackground}>
                <Image 
                  source={require('@/assets/splash/h-logo.png')} 
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
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
                <View style={styles.inputGroup}>
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
                  We'll send you a verification code via SMS. Standard message rates apply.
                </Text>

                {phoneNumber.length > 0 && !isValidPhoneNumber(phoneNumber) && (
                  <Text style={styles.errorText}>
                    Please enter a valid phone number (09XXXXXXXXX)
                  </Text>
                )}

                <TouchableOpacity 
                  style={[
                    styles.primaryButton, 
                    isValidPhoneNumber(phoneNumber) && styles.primaryButtonActive,
                    isLoading && styles.primaryButtonLoading
                  ]}
                  onPress={handleContinue}
                  disabled={!isValidPhoneNumber(phoneNumber) || isLoading}
                  activeOpacity={0.8}
                >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <View style={styles.loadingSpinner} />
                    <Text style={styles.primaryButtonText}>Signing in...</Text>
                  </View>
                ) : (
                  <Text style={styles.primaryButtonText}>Continue</Text>
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
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing['4xl'],
    paddingBottom: Spacing['2xl'],
  },

  // Modern Header
  header: {
    alignItems: 'center',
    marginBottom: Spacing['4xl'],
  },
  logoContainer: {
    marginBottom: Spacing.lg,
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.softLg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logo: {
    width: 60,
    height: 60,
  },
  appName: {
    fontSize: 32,
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
    borderRadius: 24,
    padding: Spacing['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    ...Shadows.softLg,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  welcomeText: {
    fontSize: 28,
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
    marginBottom: Spacing['2xl'],
  },
  inputGroup: {
    marginBottom: Spacing.lg,
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
  inputWrapperFocused: {
    borderColor: '#667EEA',
    backgroundColor: '#FFFFFF',
    ...Shadows.softBase,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 0,
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
    borderRadius: 16,
    paddingVertical: Spacing.lg,
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
});
