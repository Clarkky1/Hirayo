import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Rental details - in a real app this would come from navigation params or context
  const rentalDetails = {
    itemName: 'Canon EOS 90D DSLR Camera',
    itemImage: 'https://via.placeholder.com/150x150?text=Canon+90D',
    renterName: 'John Doe',
    lenderName: 'Sarah Johnson',
    lenderLocation: 'Cebu City, Philippines',
    startDate: '2025-08-14',
    endDate: '2025-08-17',
    duration: '4 days',
    dailyRate: 1253,
    subtotal: 5012,
    taxRate: 0.12, // 12% tax
    taxAmount: 601.44,
    serviceFee: 100,
    totalAmount: 5713.44,
    pickupLocation: 'Cebu City Center',
    returnLocation: 'Cebu City Center',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN-' + Date.now().toString().slice(-8)
  };

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

    console.log('Payment successful, starting countdown'); // Debug log
    
    // Show payment success and start countdown
    setShowCountdown(true);
    setCountdown(5); // Reset countdown to 5 seconds
    
    console.log('Countdown state set to:', 5); // Debug log
  };

  useEffect(() => {
    // Only start countdown when showCountdown becomes true
    if (showCountdown) {
      console.log('Starting countdown:', countdown); // Debug log
      
      // Clear any existing interval first
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }

      // Start the countdown
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          console.log('Countdown tick:', prev); // Debug log
          if (prev <= 1) {
            console.log('Countdown finished, navigating to receipt'); // Debug log
            
            // Clear the interval
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
              countdownRef.current = null;
            }
            
            // Navigate directly to receipt page
            router.replace({
              pathname: '/receipt',
              params: {
                showReceipt: 'true',
                paymentAmount: rentalDetails.totalAmount.toString(),
                itemName: rentalDetails.itemName,
                renterName: rentalDetails.renterName,
                lenderName: rentalDetails.lenderName,
                lenderLocation: rentalDetails.lenderLocation,
                startDate: rentalDetails.startDate,
                endDate: rentalDetails.endDate,
                duration: rentalDetails.duration,
                dailyRate: rentalDetails.dailyRate.toString(),
                subtotal: rentalDetails.subtotal.toString(),
                taxAmount: rentalDetails.taxAmount.toString(),
                serviceFee: rentalDetails.serviceFee.toString(),
                totalAmount: rentalDetails.totalAmount.toString(),
                pickupLocation: rentalDetails.pickupLocation,
                returnLocation: rentalDetails.returnLocation,
                paymentMethod: rentalDetails.paymentMethod,
                transactionId: rentalDetails.transactionId
              }
            });
            
            // Reset the countdown state
            setCountdown(5);
            setShowCountdown(false);
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [showCountdown]); // Only depend on showCountdown

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
          
          {/* Item Details */}
          <View style={styles.orderItem}>
            <View style={styles.orderItemInfo}>
              <Text style={styles.orderItemName}>{rentalDetails.itemName}</Text>
              <Text style={styles.orderItemPeriod}>{rentalDetails.duration} rental</Text>
              <Text style={styles.orderItemDates}>
                {new Date(rentalDetails.startDate).toLocaleDateString()} - {new Date(rentalDetails.endDate).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.orderItemPrice}>₱{rentalDetails.dailyRate.toLocaleString()}/day</Text>
          </View>

          {/* Pricing Breakdown */}
          <View style={styles.pricingBreakdown}>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Daily Rate × {rentalDetails.duration.split(' ')[0]} days</Text>
              <Text style={styles.pricingValue}>₱{rentalDetails.subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Tax (12%)</Text>
              <Text style={styles.pricingValue}>₱{rentalDetails.taxAmount.toLocaleString()}</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Service Fee</Text>
              <Text style={styles.pricingValue}>₱{rentalDetails.serviceFee.toLocaleString()}</Text>
            </View>
          </View>

          {/* Total */}
          <View style={styles.orderTotal}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₱{rentalDetails.totalAmount.toLocaleString()}</Text>
          </View>

          {/* Rental Details */}
          <View style={styles.rentalDetails}>
            <View style={styles.rentalDetailRow}>
              <Ionicons name="person-outline" size={16} color={Colors.text.secondary} />
              <Text style={styles.rentalDetailText}>Renter: {rentalDetails.renterName}</Text>
            </View>
            <View style={styles.rentalDetailRow}>
              <Ionicons name="business-outline" size={16} color={Colors.text.secondary} />
              <Text style={styles.rentalDetailText}>Lender: {rentalDetails.lenderName}</Text>
            </View>
            <View style={styles.rentalDetailRow}>
              <Ionicons name="location-outline" size={16} color={Colors.text.secondary} />
              <Text style={styles.rentalDetailText}>Location: {rentalDetails.lenderLocation}</Text>
            </View>
            <View style={styles.rentalDetailRow}>
              <Ionicons name="car-outline" size={16} color={Colors.text.secondary} />
              <Text style={styles.rentalDetailText}>Pickup: {rentalDetails.pickupLocation}</Text>
            </View>
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
          <Text style={styles.payButtonText}>Pay ₱{rentalDetails.totalAmount.toLocaleString()}</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Success Countdown Overlay */}
      {showCountdown && (
        <View style={styles.countdownOverlay}>
          <View style={styles.countdownContent}>
            <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successMessage}>
              Redirecting to receipt in {countdown} seconds...
            </Text>
          </View>
        </View>
      )}
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
  orderItemDates: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  orderItemPrice: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  pricingBreakdown: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  pricingLabel: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
  },
  pricingValue: {
    ...TextStyles.body.medium,
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
  rentalDetails: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  rentalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  rentalDetailText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    marginLeft: Spacing.sm,
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
 
  },
  payButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',

  },
  payButtonText: {
    ...TextStyles.button.large,
    color: Colors.text.inverse,
  },
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  countdownContent: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    ...TextStyles.heading.h2,
    color: Colors.text.primary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  successMessage: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  countdownCircle: {
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.full,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    ...TextStyles.heading.h1,
    color: Colors.primary[500],
  },
});
