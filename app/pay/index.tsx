import { BorderRadius, Colors, Shadows, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
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

interface PaymentMethod {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: 'card' | 'digital' | 'bank';
}

const paymentMethods: PaymentMethod[] = [
  { id: '1', name: 'Credit/Debit Card', icon: 'card', type: 'card' },
  { id: '2', name: 'GCash', icon: 'phone-portrait', type: 'digital' },
  { id: '3', name: 'PayMaya', icon: 'wallet', type: 'digital' },
  { id: '4', name: 'Bank Transfer', icon: 'business', type: 'bank' },
];

export default function PaymentScreen() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handlePay = () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Payment Method Required', 'Please select a payment method');
      return;
    }

    if (selectedPaymentMethod === '1') {
      // Credit/Debit Card validation
      if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        Alert.alert('Missing Information', 'Please fill in all card details');
        return;
      }
    }

    Alert.alert(
      'Payment Processing',
      'Your payment is being processed. You will receive a confirmation shortly.',
      [
        {
          text: 'OK',
          onPress: () => router.push('/transactions'),
        },
      ]
    );
  };

  const renderPaymentMethod = (method: PaymentMethod) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethodCard,
        selectedPaymentMethod === method.id && styles.selectedPaymentMethod,
      ]}
      onPress={() => handlePaymentMethodSelect(method.id)}
    >
      <View style={styles.paymentMethodContent}>
        <View style={styles.paymentMethodIcon}>
          <Ionicons name={method.icon} size={24} color={Colors.primary[500]} />
        </View>
        <Text style={styles.paymentMethodName}>{method.name}</Text>
      </View>
      {selectedPaymentMethod === method.id && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.primary[500]} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.orderSummarySection}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.orderItem}>
            <View style={styles.orderItemInfo}>
              <Text style={styles.orderItemName}>Canon EOS 90D DSLR Camera</Text>
              <Text style={styles.orderItemPeriod}>4 days rental</Text>
            </View>
            <Text style={styles.orderItemPrice}>₱5,012</Text>
          </View>
          <View style={styles.orderTotal}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₱5,012</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethodsSection}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {paymentMethods.map(renderPaymentMethod)}
        </View>

        {/* Card Details (shown only when card is selected) */}
        {selectedPaymentMethod === '1' && (
          <View style={styles.cardDetailsSection}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>
            <View style={styles.cardRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: Spacing.sm }]}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  maxLength={5}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: Spacing.sm }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                value={cardholderName}
                onChangeText={setCardholderName}
                autoCapitalize="words"
              />
            </View>
          </View>
        )}

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
          <Text style={styles.securityText}>
            Your payment information is secure and encrypted
          </Text>
        </View>

        {/* Bottom spacing for footer */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Payment Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payButtonText}>Pay ₱5,012</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  orderSummarySection: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  sectionTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  orderItemPeriod: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
  },
  orderItemPrice: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  totalLabel: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
  },
  totalAmount: {
    ...TextStyles.heading.h2,
    color: Colors.primary[500],
    fontWeight: '700',
  },
  paymentMethodsSection: {
    marginBottom: Spacing.sm,
  },
  paymentMethodCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  selectedPaymentMethod: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    marginRight: Spacing.sm,
  },
  paymentMethodName: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  selectedIndicator: {
    marginLeft: Spacing.sm,
  },
  cardDetailsSection: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  inputGroup: {
    marginBottom: Spacing.sm,
  },
  inputLabel: {
    ...TextStyles.body.small,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.base,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...TextStyles.body.medium,
    color: Colors.text.primary,
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  securityText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  bottomSpacing: {
    height: 120,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    ...Shadows.lg,
  },
  payButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    ...Shadows.button,
  },
  payButtonText: {
    ...TextStyles.button.large,
    color: Colors.text.inverse,
  },
});
