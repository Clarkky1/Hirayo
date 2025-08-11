import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ItemDetailScreen() {
  const [activeTab, setActiveTab] = useState<'description' | 'review'>('description');
  const [showMore, setShowMore] = useState(false);



  const handleFavorite = () => {
    console.log('Favorite pressed');
  };

  const handleRent = () => {
    router.push('/period');
  };

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Header */}
        <View style={styles.productHeader}>
          <Text style={styles.productName}>Canon EOS 90D DSLR Camera</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>P1,253</Text>
            <Text style={styles.rentalPeriod}>for a day</Text>
          </View>
        </View>

        {/* Product Image/Carousel Section */}
        <View style={styles.imageSection}>
          <View style={styles.imagePlaceholder}>
            <TouchableOpacity style={styles.favoriteIcon} onPress={handleFavorite}>
              <Ionicons name="heart-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
          </View>
        </View>

        {/* Tabs Section */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'description' && styles.activeTab]} 
            onPress={() => setActiveTab('description')}
          >
            <Text style={[styles.tabText, activeTab === 'description' && styles.activeTabText]}>
              Description
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'review' && styles.activeTab]} 
            onPress={() => setActiveTab('review')}
          >
            <Text style={[styles.tabText, activeTab === 'review' && styles.activeTabText]}>
              Review
            </Text>
          </TouchableOpacity>
        </View>

        {/* Description Content */}
        {activeTab === 'description' && (
          <View style={styles.descriptionContent}>
            <Text style={styles.descriptionText}>
              Capture high-resolution photos and 4K video with this versatile DSLR. Perfect for events, travel, or content creation. Rent it for a day or a week — no strings attached.
            </Text>
            <TouchableOpacity style={styles.showMoreButton} onPress={handleShowMore}>
              <Text style={styles.showMoreText}>Show more</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Review Content */}
        {activeTab === 'review' && (
          <View style={styles.reviewContent}>
            {/* Review Summary */}
            <View style={styles.reviewSummary}>
              <Text style={styles.reviewSummaryText}>★ 4.76 · 12 reviews</Text>
            </View>

            {/* Individual Reviews */}
            <View style={styles.reviewsList}>
              {/* First Review */}
              <View style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.starsRow}>
                    <Ionicons name="star" size={16} color="#000" />
                    <Ionicons name="star" size={16} color="#000" />
                    <Ionicons name="star" size={16} color="#000" />
                    <Ionicons name="star" size={16} color="#000" />
                    <Ionicons name="star" size={16} color="#000" />
                  </View>
                  <Text style={styles.reviewDate}>January 12, 2025</Text>
                </View>
                <Text style={styles.reviewText}>
                  The camera was in excellent condition and worked flawlessly throughout a 4-day shoot. Batteries were fully charged, lenses were clean, and everything came in a padded case — very professional setup. Setup w...
                </Text>
                <TouchableOpacity style={styles.showMoreLink}>
                  <Text style={styles.showMoreLinkText}>Show more</Text>
                </TouchableOpacity>
                <View style={styles.reviewerInfo}>
                  <View style={styles.reviewerAvatar} />
                  <Text style={styles.reviewerName}>Alyssa T.</Text>
                </View>
              </View>

              {/* Second Review */}
              <View style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.starsRow}>
                    <Ionicons name="star" size={16} color="#000" />
                    <Ionicons name="star" size={16} color="#000" />
                    <Ionicons name="star" size={16} color="#000" />
                  </View>
                  <Text style={styles.reviewDate}>January 10, 2025</Text>
                </View>
                <Text style={styles.reviewText}>
                  The flawless fully in a Show...
                </Text>
                <View style={styles.reviewerInfo}>
                  <View style={styles.reviewerAvatar} />
                  <Text style={styles.reviewerName}>John D.</Text>
                </View>
              </View>
            </View>

            {/* Show All Reviews Button */}
            <TouchableOpacity style={styles.showAllReviewsButton}>
              <Text style={styles.showAllReviewsText}>Show all 12 reviews</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Statistics/Metrics Section - Only show in description tab */}
        {activeTab === 'description' && (
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10</Text>
              <Text style={styles.statLabel}>Rented</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5.0</Text>
              <View style={styles.starsContainer}>
                <Ionicons name="star" size={16} color="#000" />
                <Ionicons name="star" size={16} color="#000" />
                <Ionicons name="star" size={16} color="#000" />
                <Ionicons name="star" size={16} color="#000" />
                <Ionicons name="star" size={16} color="#000" />
              </View>
            </View>
          </View>
        )}

        {/* Owner Information Section - Only show in description tab */}
        {activeTab === 'description' && (
          <View style={styles.ownerSection}>
            <Text style={styles.ownerLabel}>Owner</Text>
            <View style={styles.ownerInfo}>
              <View style={styles.ownerAvatar} />
                             <Text style={styles.ownerName}>Lorenz Aguirre</Text>
            </View>
          </View>
        )}

        {/* Bottom spacing for action bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <View style={styles.priceDisplay}>
          <Text style={styles.actionBarPrice}>P1,253</Text>
          <Text style={styles.actionBarPeriod}>For a day</Text>
        </View>
        <TouchableOpacity style={styles.rentButton} onPress={handleRent}>
          <Text style={styles.rentButtonText}>Rent</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollView: {
    flex: 1,
    paddingTop: 16,
  },
  productHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textDecorationLine: 'underline',
    marginRight: 8,
  },
  rentalPeriod: {
    fontSize: 14,
    color: '#666666',
  },
  imageSection: {
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 'auto',
    height: 250,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    marginHorizontal: 20,
    position: 'relative',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 8,
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#666666',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00A86B',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000000',
    fontWeight: '600',
  },
  descriptionContent: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 15,
  },
  showMoreButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  showMoreText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00A86B',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#000000',
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  ownerSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  ownerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00A86B',
  },
  bottomSpacing: {
    height: 100,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: Platform.OS === 'ios' ? 35 : 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  priceDisplay: {
    flex: 1,
  },
  actionBarPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textDecorationLine: 'underline',
  },
  actionBarPeriod: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  rentButton: {
    backgroundColor: '#0066CC',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  rentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Review styles
  reviewContent: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  reviewSummary: {
    marginBottom: 20,
  },
  reviewSummaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  reviewsList: {
    marginBottom: 20,
  },
  reviewItem: {
    marginBottom: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 14,
    color: '#666666',
  },
  reviewText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 8,
  },
  showMoreLink: {
    marginBottom: 12,
  },
  showMoreLinkText: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '500',
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    marginRight: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  showAllReviewsButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  showAllReviewsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  imageContainer: {
    height: 300,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  actionButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
    ...Shadows.button,
  },
});
