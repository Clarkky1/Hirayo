import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/DesignSystem';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinue = () => {
    console.log('Continue with:', phoneNumber);
    // Use authentication hook to login
    login({ phoneNumber });
    // Navigate to main app after successful login
    router.push('/(tabs)');
  };

  const handleFacebookLogin = () => {
    console.log('Facebook login');
    // Use authentication hook to login
    login({ provider: 'facebook' });
    // Navigate to main app after successful login
    router.push('/(tabs)');
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
    // Use authentication hook to login
    login({ provider: 'google' });
    // Navigate to main app after successful login
    router.push('/(tabs)');
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
        <View style={styles.content}>
          <Text style={styles.header}>Log in or Sign up</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              autoFocus={false}
            />
          </View>

          <Text style={styles.termsText}>
            We will text you to confirm your number. Standard message and data rates apply.
          </Text>

          <TouchableOpacity 
            style={[styles.continueButton, phoneNumber.length > 0 && styles.continueButtonActive]}
            onPress={handleContinue}
            disabled={phoneNumber.length === 0}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
            <View style={styles.socialButtonContent}>
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
              <Text style={styles.socialButtonText}>Continue with Facebook</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <View style={styles.socialButtonContent}>
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 48,
    paddingBottom: 32,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
    color: '#000000',
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputField: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.softXs,
  },
  termsText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
    ...Shadows.softButton,
  },
  continueButtonActive: {
    backgroundColor: '#0066cc',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E1E1',
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    color: '#666666',
    fontSize: 14,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  signupText: {
    fontSize: 14,
    color: '#666666',
  },
  signupLink: {
    fontSize: 14,
    color: Colors.primary[500],
    fontWeight: '600',
  },
});
