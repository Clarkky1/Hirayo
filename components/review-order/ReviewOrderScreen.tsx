import { BorderRadius, Colors, Shadows, Spacing, TextStyles } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ReviewOrderScreen() {
  const handleStartDatePress = () => {
    console.log('Start date pressed');
  };

  const handleReturnDatePress = () => {
    console.log('Return date pressed');
  };

  const handleShowReviews = () => {
    console.log('Show reviews pressed');
  };

  const handlePay = () => {
    console.log('Pay pressed');
  };

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Information Section */}
        <View style={styles.productSection}>
          {/* Product Image Placeholder */}
          <View style={styles.imagePlaceholder} />
          
          {/* Product Name */}
          <Text style={styles.productName}>Canon EOS 90D DSLR Camera</Text>
          
          {/* Price per Day */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₱1,253</Text>
            <Text style={styles.pricePeriod}>for a day</Text>
          </View>
        </View>

        {/* Rental Period Details */}
        <View style={styles.rentalPeriodSection}>
          <Text style={styles.sectionTitle}>Rental Period</Text>
          <View style={styles.rentalRow}>
            {/* Start Date */}
            <View style={styles.dateColumn}>
              <View style={styles.dateHeader}>
                <Ionicons name="calendar-outline" size={20} color={Colors.primary[500]} />
                <Text style={styles.dateLabel}>Start Date</Text>
              </View>
              <TouchableOpacity style={styles.dateSelector} onPress={handleStartDatePress}>
                <View style={styles.dateContent}>
                  <Text style={styles.dateValue}>08-14-2025</Text>
                  <Text style={styles.dateSubtext}>Monday</Text>
                </View>
                <View style={styles.chevronContainer}>
                  <Ionicons name="chevron-down" size={20} color={Colors.primary[500]} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Return Date */}
            <View style={styles.dateColumn}>
              <View style={styles.dateHeader}>
                <Ionicons name="calendar-outline" size={20} color={Colors.primary[500]} />
                <Text style={styles.dateLabel}>Return Date</Text>
              </View>
              <TouchableOpacity style={styles.dateSelector} onPress={handleReturnDatePress}>
                <View style={styles.dateContent}>
                  <Text style={styles.dateValue}>08-17-2025</Text>
                  <Text style={styles.dateSubtext}>Thursday</Text>
                </View>
                <View style={styles.chevronContainer}>
                  <Ionicons name="chevron-down" size={20} color={Colors.primary[500]} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Duration Summary */}
          <View style={styles.durationSummary}>
            <View style={styles.durationItem}>
              <Ionicons name="time-outline" size={18} color={Colors.text.secondary} />
              <Text style={styles.durationText}>4 days rental</Text>
            </View>
            <View style={styles.durationItem}>
              <Ionicons name="information-circle-outline" size={18} color={Colors.text.secondary} />
              <Text style={styles.durationText}>Free pickup & return</Text>
            </View>
          </View>
        </View>

        {/* Reviews Button */}
        <TouchableOpacity style={styles.reviewsButton} onPress={handleShowReviews}>
          <Text style={styles.reviewsButtonText}>Show all 12 reviews</Text>
        </TouchableOpacity>

        {/* Bottom spacing for footer */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <View style={styles.totalSection}>
          <Text style={styles.totalPrice}>₱5,012</Text>
          <Text style={styles.totalPeriod}>for 4 days</Text>
        </View>
        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payButtonText}>Pay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    ...Shadows.card,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  productSection: {
    marginBottom: Spacing.xl,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.neutral[300],
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  productName: {
    ...TextStyles.heading.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    ...TextStyles.heading.h3,
    color: Colors.text.primary,
    textDecorationLine: 'underline',
    marginRight: Spacing.sm,
  },
  pricePeriod: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
  },
  rentalPeriodSection: {
    marginBottom: Spacing.xl,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  sectionTitle: {
    ...TextStyles.heading.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  rentalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  dateColumn: {
    flex: 1,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  dateLabel: {
    ...TextStyles.body.medium,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  dateSelector: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.sm,
  },
  dateContent: {
    flex: 1,
  },
  dateValue: {
    ...TextStyles.body.medium,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  dateSubtext: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  chevronContainer: {
    paddingLeft: Spacing.sm,
  },
  durationSummary: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
    ...Shadows.sm,
  },
  durationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  durationText: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
  },
  reviewsButton: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.base,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  reviewsButtonText: {
    ...TextStyles.button.medium,
    color: Colors.text.primary,
  },
  bottomSpacing: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: 35,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    ...Shadows.lg,
  },
  totalSection: {
    flex: 1,
  },
  totalPrice: {
    ...TextStyles.heading.h2,
    color: Colors.text.primary,
    textDecorationLine: 'underline',
  },
  totalPeriod: {
    ...TextStyles.body.small,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  payButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.base,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    ...Shadows.base,
  },
  payButtonText: {
    ...TextStyles.button.medium,
    color: Colors.text.inverse,
  },
});
