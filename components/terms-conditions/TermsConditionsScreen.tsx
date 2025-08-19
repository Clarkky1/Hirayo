import { Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function TermsConditionsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Terms and Conditions</Text>
          <Text style={styles.lastUpdated}>Last updated: August 2025</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.paragraph}>
              By accessing and using the Hirayo rental platform, you accept and agree to be bound by the terms and provision of this agreement.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Description of Service</Text>
            <Text style={styles.paragraph}>
              Hirayo is a peer-to-peer rental platform that connects item owners (lenders) with individuals seeking to rent items (renters). Our service facilitates the rental process but is not a party to any rental agreement.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
            <Text style={styles.paragraph}>
              Users are responsible for providing accurate information, maintaining the security of their accounts, and complying with all applicable laws and regulations.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Rental Agreements</Text>
            <Text style={styles.paragraph}>
              All rental agreements are between the lender and renter. Hirayo is not responsible for the terms, conditions, or fulfillment of these agreements.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Payment and Fees</Text>
            <Text style={styles.paragraph}>
              Users agree to pay all applicable fees for the service. Payment processing is handled by third-party providers and subject to their terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Prohibited Activities</Text>
            <Text style={styles.paragraph}>
              Users may not use the service for illegal purposes, violate intellectual property rights, or engage in fraudulent activities.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
            <Text style={styles.paragraph}>
              Hirayo shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Privacy Policy</Text>
            <Text style={styles.paragraph}>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Modifications to Terms</Text>
            <Text style={styles.paragraph}>
              We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Contact Information</Text>
            <Text style={styles.paragraph}>
              If you have any questions about these Terms and Conditions, please contact us at support@hirayo.com
            </Text>
          </View>
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
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    ...TextStyles.heading.h1,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  lastUpdated: {
    ...TextStyles.caption,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  paragraph: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
});
