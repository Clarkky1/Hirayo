import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/DesignSystem';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

  const handleBack = () => {
    router.back();
  };

  const handleAgreeAndContinue = () => {
    // Handle form submission
    const userData = { firstName, surname, dateOfBirth, email };
    console.log('Form submitted:', userData);
    // Use authentication hook to signup
    signup(userData);
    // Navigate to main app after successful signup
    router.replace('/(tabs)');
  };

  const isFormValid = firstName.trim() && surname.trim() && dateOfBirth.trim() && email.trim();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
                <Ionicons name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Finish signing up</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Legal Name</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="First name on ID"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Surname on ID"
                  value={surname}
                  onChangeText={setSurname}
                  autoCapitalize="words"
                />
              </View>
              <Text style={styles.helperText}>
                Make sure this matches the name on your government-issued ID.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Date of birth</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Date of birth"
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                />
              </View>
              <Text style={styles.helperText}>
                To sign up, you need to be at least 18. Other people who use Hirayo won&apos;t see your date of birth
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Email</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <Text style={styles.helperText}>
                We&apos;ll email you a reservation confirmation
              </Text>
            </View>

            <View style={styles.agreementContainer}>
              <Text style={styles.agreementText}>
                By selecting{' '}
                <Text style={styles.linkText}>Agree and continue</Text>
                , I agree to Hirayo&apos;s{' '}
                <Text style={styles.linkText}>Terms of Service</Text>
                ,{' '}
                <Text style={styles.linkText}>Payment of Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.linkText}>Anti-Discrimination Policy</Text>
                , and acknowledge the{' '}
                <Text style={styles.linkText}>Privacy Policy</Text>
                .
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.continueButton, isFormValid && styles.continueButtonActive]}
              onPress={handleAgreeAndContinue}
              disabled={!isFormValid}
              activeOpacity={0.7}
            >
              <Text style={styles.continueButtonText}>Agree and continue</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
                <Text style={styles.loginLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 32,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  helperText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  agreementContainer: {
    marginBottom: 24,
  },
  agreementText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  linkText: {
    color: '#000000',
    fontWeight: '500',
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
    backgroundColor: '#333333',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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
  loginContainer: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#666666',
  },
  loginLink: {
    color: Colors.primary[500],
    fontSize: 14,
    fontWeight: '500',
  },
});
