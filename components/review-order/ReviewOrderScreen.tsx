import { BorderRadius, Colors, Spacing, TextStyles } from '@/constants/DesignSystem';
import { useNavigationGuard } from '@/hooks/useNavigationGuard';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Image,
    PanResponder,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ReviewOrderScreen() {
  const { validateAndNavigate, goBack } = useNavigationGuard();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Animation value for swipe gestures
  const pan = useRef(new Animated.ValueXY()).current;
  
  // Mock images for demonstration
  const itemImages = [
    'https://picsum.photos/400/300?random=1',
    'https://picsum.photos/400/300?random=2',
    'https://picsum.photos/400/300?random=3',
    'https://picsum.photos/400/300?random=4',
    'https://picsum.photos/400/300?random=5',
  ];

  const handleShowReviews = () => {
    console.log('Show reviews pressed');
  };

  const handlePay = () => {
    // Validate that user has confirmed rental details before proceeding
    const validationFn = () => {
      // Add any validation logic here (e.g., check if dates are selected)
      return true; // For now, always allow proceeding
    };
    
    validateAndNavigate('payment', validationFn);
  };

  const handleGoBack = () => {
    goBack('rental-period');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === itemImages.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? itemImages.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // PanResponder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Limit horizontal movement and add some resistance
        const limitedDx = Math.max(-100, Math.min(100, gestureState.dx * 0.3));
        pan.setValue({ x: limitedDx, y: 0 });
      },
      onPanResponderRelease: (_, gestureState) => {
        const swipeThreshold = 50;
        
        if (gestureState.dx > swipeThreshold) {
          // Swipe right - go to previous image
          previousImage();
        } else if (gestureState.dx < -swipeThreshold) {
          // Swipe left - go to next image
          nextImage();
        }
        
        // Reset pan value with smooth animation
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }).start();
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Order</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Information Section */}
        <View style={styles.productSection}>
          {/* Product Image Carousel */}
          <View style={styles.imageContainer}>
            <Animated.View 
              style={[
                styles.imageCarousel,
                {
                  transform: pan.getTranslateTransform(),
                }
              ]}
              {...panResponder.panHandlers}
            >
              <Image 
                source={{ uri: itemImages[currentImageIndex] }} 
                style={styles.mainImage}
                resizeMode="cover"
              />
              
              {/* Navigation Arrows */}
              <TouchableOpacity 
                style={[styles.navArrow, styles.leftArrow]} 
                onPress={previousImage}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={20} color={Colors.text.inverse} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.navArrow, styles.rightArrow]} 
                onPress={nextImage}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-forward" size={20} color={Colors.text.inverse} />
              </TouchableOpacity>
              
              {/* Image Counter */}
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {currentImageIndex + 1} of {itemImages.length}
                </Text>
              </View>
            </Animated.View>
            
            {/* Image Indicators */}
            <View style={styles.imageIndicators}>
              {itemImages.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.indicator,
                    index === currentImageIndex && styles.activeIndicator
                  ]}
                  onPress={() => goToImage(index)}
                  activeOpacity={0.7}
                />
              ))}
            </View>
          </View>
          
          {/* Product Name */}
          <Text style={styles.productName}>Canon EOS 90D DSLR Camera</Text>
          
          {/* Price per Day */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₱2,500</Text>
            <Text style={styles.pricePeriod}>for a day</Text>
          </View>
        </View>

        {/* Rental Period Confirmation */}
        <View style={styles.rentalPeriodSection}>
          <View style={styles.confirmationHeader}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            <Text style={styles.sectionTitle}>Rental Period Confirmation</Text>
          </View>
          <View style={styles.rentalRow}>
            {/* Start Date */}
            <View style={styles.dateColumn}>
              <View style={styles.dateHeader}>
                <Ionicons name="calendar-outline" size={20} color={Colors.primary[500]} />
                <Text style={styles.dateLabel}>Start Date</Text>
              </View>
              <View style={styles.dateDisplay}>
                <View style={styles.dateContent}>
                  <Text style={styles.dateValue}>08-14-2025</Text>
                  <Text style={styles.dateSubtext}>Monday</Text>
                </View>
              </View>
            </View>

            {/* Return Date */}
            <View style={styles.dateColumn}>
              <View style={styles.dateHeader}>
                <Ionicons name="calendar-outline" size={20} color={Colors.primary[500]} />
                <Text style={styles.dateLabel}>Return Date</Text>
              </View>
              <View style={styles.dateDisplay}>
                <View style={styles.dateContent}>
                  <Text style={styles.dateValue}>08-17-2025</Text>
                  <Text style={styles.dateSubtext}>Thursday</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Duration Summary */}
          <View style={styles.durationSummary}>
            <View style={styles.durationItem}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.durationText}>4 days rental</Text>
            </View>
            <View style={styles.durationItem}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.durationText}>Free pickup & return</Text>
            </View>
          </View>
        </View>

        {/* Bottom spacing for footer */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <View style={styles.totalSection}>
          <Text style={styles.totalPrice}>₱10,000</Text>
          <Text style={styles.totalPeriod}>for 4 days</Text>
        </View>
        <TouchableOpacity style={styles.payButton} onPress={handlePay} activeOpacity={0.7}>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    ...TextStyles.heading.h2,
    color: Colors.text.primary,
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: Spacing.md,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  productSection: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.neutral[300],
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    position: 'relative',
  },
  imageCarousel: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.lg,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.lg,
  },
  navArrow: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -10 }],
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.base,
    padding: Spacing.sm,
    zIndex: 10,
  },
  leftArrow: {
    left: Spacing.sm,
  },
  rightArrow: {
    right: Spacing.sm,
  },
  imageCounter: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.base,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.text.inverse,
  },
  imageCounterText: {
    ...TextStyles.body.small,
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.neutral[400],
  },
  activeIndicator: {
    backgroundColor: Colors.primary[500],
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
    marginBottom: Spacing.lg,
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.success,
  },
  confirmationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...TextStyles.heading.h2,
    color: Colors.text.primary,
    marginBottom: 0,
    textAlign: 'center',
  },
  rentalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  dateColumn: {
    flex: 1,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  dateLabel: {
    ...TextStyles.body.medium,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  dateDisplay: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

  durationSummary: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.success,
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
  },
  payButtonText: {
    ...TextStyles.button.medium,
    color: Colors.text.inverse,
  },
});
