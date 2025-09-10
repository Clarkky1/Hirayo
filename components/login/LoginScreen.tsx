import { BorderRadius, Colors, Shadows, Spacing, TextStyles, Typography } from '@/constants/DesignSystem';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Animated,
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
  const [focusedInput, setFocusedInput] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = async () => {
    if (phoneNumber.length === 0) return;
    
    setIsLoading(true);
    try {
      console.log('Continue with:', phoneNumber);
      // Use authentication hook to login
      await login({ phoneNumber });
      // Navigate to main app after successful login
      router.replace('/(tabs)');
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
      // Navigate to main app after successful login
      router.replace('/(tabs)');
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
      // Navigate to main app after successful login
      router.replace('/(tabs)');
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
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Background Gradient */}
        <View style={styles.backgroundGradient} />
        
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
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

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.subtitleText}>Sign in to continue your journey</Text>

            {/* Phone Input Section */}
            <View style={styles.inputSection}>
              <View style={styles.inputContainer}>
                <View style={[
                  styles.inputWrapper,
                  focusedInput && styles.inputWrapperFocused
                ]}>
                  <Ionicons 
                    name="call-outline" 
                    size={20} 
                    color={focusedInput ? Colors.primary[500] : Colors.text.tertiary} 
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Enter your phone number"
                    placeholderTextColor={Colors.text.tertiary}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    onFocus={() => setFocusedInput(true)}
                    onBlur={() => setFocusedInput(false)}
                    keyboardType="phone-pad"
                    autoFocus={false}
                    editable={!isLoading}
                  />
                </View>
              </View>

              <Text style={styles.termsText}>
                We'll send you a verification code via SMS. Standard message rates apply.
              </Text>

              <TouchableOpacity 
                style={[
                  styles.continueButton, 
                  phoneNumber.length > 0 && styles.continueButtonActive,
                  isLoading && styles.continueButtonLoading
                ]}
                onPress={handleContinue}
                disabled={phoneNumber.length === 0 || isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Animated.View style={styles.loadingSpinner} />
                    <Text style={styles.continueButtonText}>Signing in...</Text>
                  </View>
                ) : (
                  <Text style={styles.continueButtonText}>Continue</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
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

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>New to Hirayo? </Text>
              <TouchableOpacity onPress={handleSignup} activeOpacity={0.7}>
                <Text style={styles.signupLink}>Create account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: Colors.primary[50],
    borderBottomLeftRadius: BorderRadius['3xl'],
    borderBottomRightRadius: BorderRadius['3xl'],
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing['4xl'],
    paddingBottom: Spacing['2xl'],
  },
  
  // Logo Section
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing['6xl'],
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.softLg,
  },
  logo: {
    width: 50,
    height: 50,
  },
  appName: {
    ...TextStyles.heading.h1,
    color: Colors.primary[500],
    marginBottom: Spacing.xs,
  },
  tagline: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // Main Content
  mainContent: {
    flex: 1,
  },
  welcomeText: {
    ...TextStyles.heading.h2,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitleText: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing['6xl'],
  },

  // Input Section
  inputSection: {
    marginBottom: Spacing['6xl'],
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.border.light,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    ...Shadows.softSm,
  },
  inputWrapperFocused: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.background.primary,
    ...Shadows.softBase,
  },
  inputIcon: {
    marginRight: Spacing.md,
  },
  inputField: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.primary,
    paddingVertical: 0,
  },
  inputFieldFocused: {
    // Focus styles handled by inputWrapper border
  },
  termsText: {
    ...TextStyles.caption,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
    lineHeight: 18,
  },

  // Continue Button
  continueButton: {
    backgroundColor: Colors.neutral[300],
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    ...Shadows.softButton,
  },
  continueButtonActive: {
    backgroundColor: Colors.primary[500],
    ...Shadows.primary,
  },
  continueButtonLoading: {
    backgroundColor: Colors.primary[400],
  },
  continueButtonText: {
    ...TextStyles.button.medium,
    color: Colors.text.inverse,
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
    borderColor: Colors.text.inverse,
    borderTopColor: 'transparent',
    marginRight: Spacing.sm,
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.light,
  },
  dividerText: {
    marginHorizontal: Spacing.lg,
    ...TextStyles.caption,
    color: Colors.text.tertiary,
  },

  // Social Buttons
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing['6xl'],
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    marginHorizontal: Spacing.xs,
    ...Shadows.softSm,
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  googleButton: {
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  socialButtonText: {
    ...TextStyles.button.small,
    marginLeft: Spacing.sm,
    color: Colors.text.inverse,
  },
  googleButtonText: {
    color: Colors.text.primary,
  },

  // Sign Up
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
  },
  signupLink: {
    ...TextStyles.link,
    fontSize: Typography.fontSize.sm,
  },
});
