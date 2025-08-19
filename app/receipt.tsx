import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ReceiptScreen() {
  const params = useLocalSearchParams();

  // Extract all receipt details from navigation params
  const showReceipt = Array.isArray(params.showReceipt) ? params.showReceipt[0] : params.showReceipt;
  const paymentAmount = Array.isArray(params.paymentAmount) ? params.paymentAmount[0] : params.paymentAmount;
  const itemName = Array.isArray(params.itemName) ? params.itemName[0] : params.itemName;
  const renterName = Array.isArray(params.renterName) ? params.renterName[0] : params.renterName;
  const lenderName = Array.isArray(params.lenderName) ? params.lenderName[0] : params.lenderName;
  const lenderLocation = Array.isArray(params.lenderLocation) ? params.lenderLocation[0] : params.lenderLocation;
  const startDate = Array.isArray(params.startDate) ? params.startDate[0] : params.startDate;
  const endDate = Array.isArray(params.endDate) ? params.endDate[0] : params.endDate;
  const duration = Array.isArray(params.duration) ? params.duration[0] : params.duration;
  const dailyRate = Array.isArray(params.dailyRate) ? params.dailyRate[0] : params.dailyRate;
  const subtotal = Array.isArray(params.subtotal) ? params.subtotal[0] : params.subtotal;
  const taxAmount = Array.isArray(params.taxAmount) ? params.taxAmount[0] : params.taxAmount;
  const serviceFee = Array.isArray(params.serviceFee) ? params.serviceFee[0] : params.serviceFee;
  const totalAmount = Array.isArray(params.totalAmount) ? params.totalAmount[0] : params.totalAmount;
  const pickupLocation = Array.isArray(params.pickupLocation) ? params.pickupLocation[0] : params.pickupLocation;
  const returnLocation = Array.isArray(params.returnLocation) ? params.returnLocation[0] : params.returnLocation;
  const paymentMethod = Array.isArray(params.paymentMethod) ? params.paymentMethod[0] : params.paymentMethod;
  const transactionId = Array.isArray(params.transactionId) ? params.transactionId[0] : params.transactionId;

  const handleDownloadReceipt = () => {
    // TODO: Implement download functionality
    console.log('Downloading receipt...');
  };

  const handleShareReceipt = () => {
    // TODO: Implement share functionality
    console.log('Sharing receipt...');
  };

  const handleBackPress = () => {
    // Navigate to home page instead of going back to payment page
    router.replace('/(tabs)');
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Receipt',
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
          headerLeft: () => (
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Receipt Card */}
          <View style={styles.receiptCard}>
            {/* Receipt Header */}
            <View style={styles.receiptHeader}>
              <View style={styles.companyInfo}>
                <View style={styles.logoContainer}>
                  <Text style={styles.logoText}>H</Text>
                </View>
                <View style={styles.companyDetails}>
                  <Text style={styles.companyName}>Hirayo</Text>
                  <Text style={styles.companyTagline}>Rent Anything, Anywhere</Text>
                </View>
              </View>
            </View>

            {/* Transaction ID and Date */}
            <View style={styles.transactionInfo}>
              <View style={styles.transactionRow}>
                <Text style={styles.transactionLabel}>Transaction ID:</Text>
                <Text style={styles.transactionValue}>{transactionId || 'TXN-12345678'}</Text>
              </View>
              <View style={styles.transactionRow}>
                <Text style={styles.transactionLabel}>Date:</Text>
                <Text style={styles.transactionValue}>{new Date().toLocaleDateString()}</Text>
              </View>
              <View style={styles.transactionRow}>
                <Text style={styles.transactionLabel}>Time:</Text>
                <Text style={styles.transactionValue}>{new Date().toLocaleTimeString()}</Text>
              </View>
            </View>

            {/* Item Details */}
            <View style={styles.itemSection}>
              <Text style={styles.sectionTitle}>Item Details</Text>
              <View style={styles.itemRow}>
                <View style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{itemName || 'Canon EOS 90D DSLR Camera'}</Text>
                  <Text style={styles.itemOwner}>Owner: {lenderName || 'Sarah Johnson'}</Text>
                </View>
              </View>
            </View>

            {/* Rental Details */}
            <View style={styles.rentalSection}>
              <Text style={styles.sectionTitle}>Rental Details</Text>
              <View style={styles.detailGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Renter</Text>
                  <Text style={styles.detailValue}>{renterName || 'John Doe'}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Lender</Text>
                  <Text style={styles.detailValue}>{lenderName || 'Sarah Johnson'}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{lenderLocation || 'Cebu City, Philippines'}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>{duration || '4 days'}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Start Date</Text>
                  <Text style={styles.detailValue}>
                    {startDate ? new Date(startDate).toLocaleDateString() : 'Aug 14, 2025'}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>End Date</Text>
                  <Text style={styles.detailValue}>
                    {endDate ? new Date(endDate).toLocaleDateString() : 'Aug 17, 2025'}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Pickup</Text>
                  <Text style={styles.detailValue}>{pickupLocation || 'Cebu City Center'}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Return</Text>
                  <Text style={styles.detailValue}>{returnLocation || 'Cebu City Center'}</Text>
                </View>
              </View>
            </View>

            {/* Payment Details */}
            <View style={styles.paymentSection}>
              <Text style={styles.sectionTitle}>Payment Details</Text>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Payment Method:</Text>
                <Text style={styles.paymentValue}>{paymentMethod || 'Credit Card'}</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Daily Rate:</Text>
                <Text style={styles.paymentValue}>
                  ₱{dailyRate ? parseFloat(dailyRate).toLocaleString() : '1,253'}/day
                </Text>
              </View>
            </View>

            {/* Pricing Breakdown */}
            <View style={styles.pricingSection}>
              <Text style={styles.sectionTitle}>Pricing Breakdown</Text>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>
                  Daily Rate × {duration ? duration.split(' ')[0] : '4'} days
                </Text>
                <Text style={styles.pricingValue}>
                  ₱{subtotal ? parseFloat(subtotal).toLocaleString() : '5,012'}
                </Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Tax (12%)</Text>
                <Text style={styles.pricingValue}>
                  ₱{taxAmount ? parseFloat(taxAmount).toLocaleString() : '601.44'}
                </Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Service Fee</Text>
                <Text style={styles.pricingValue}>
                  ₱{serviceFee ? parseFloat(serviceFee).toLocaleString() : '100'}
                </Text>
              </View>
              
              {/* Total Amount */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalAmount}>
                  ₱{totalAmount ? parseFloat(totalAmount).toLocaleString() : '5,713.44'}
                </Text>
              </View>
            </View>

            {/* Payment Status */}
            <View style={styles.statusSection}>
              <View style={styles.statusRow}>
                <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                <Text style={styles.statusText}>Payment Successful</Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.receiptFooter}>
              <Text style={styles.footerText}>
                Thank you for using Hirayo! This receipt serves as proof of your rental transaction.
              </Text>
              <Text style={styles.footerText}>
                For any questions, please contact our support team.
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleDownloadReceipt}>
              <Ionicons name="download-outline" size={20} color={Colors.primary[500]} />
              <Text style={styles.actionButtonText}>Download Receipt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShareReceipt}>
              <Ionicons name="share-outline" size={20} color={Colors.primary[500]} />
              <Text style={styles.actionButtonText}>Share Receipt</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </>
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
  },
  receiptCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  logoText: {
    color: Colors.text.inverse,
    fontSize: 20,
    fontWeight: 'bold',
  },
  companyDetails: {
    flex: 1,
  },
  companyName: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
  companyTagline: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
  },
  transactionInfo: {
    marginBottom: Spacing.lg,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  transactionLabel: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
  },
  transactionValue: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  itemSection: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  sectionTitle: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.base,
    marginRight: Spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  itemOwner: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
  },
  rentalSection: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    marginBottom: Spacing.sm,
  },
  detailLabel: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  detailValue: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  paymentSection: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  paymentLabel: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
  },
  paymentValue: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  pricingSection: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  pricingLabel: {
    ...TextStyles.body.medium,
    color: Colors.text.secondary,
  },
  pricingValue: {
    ...TextStyles.body.medium,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  totalLabel: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
  totalAmount: {
    ...TextStyles.heading.h3,
    color: Colors.primary[500],
    fontWeight: 'bold',
  },
  statusSection: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    ...TextStyles.heading.h3,
    color: Colors.success,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  receiptFooter: {
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  footerText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.base,
    borderWidth: 1,
    borderColor: Colors.primary[500],
    flex: 0.48,
    justifyContent: 'center',
  },
  actionButtonText: {
    ...TextStyles.body.medium,
    color: Colors.primary[500],
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  bottomSpacing: {
    height: 100,
  },
  backButton: {
    paddingHorizontal: Spacing.sm,
  },
});
