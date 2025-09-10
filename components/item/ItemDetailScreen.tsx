import { BorderRadius, Colors, Spacing } from '@/constants/DesignSystem';
import { useLender } from '@/contexts/LenderContext';
import { useSelectedItem } from '@/contexts/SelectedItemContext';
import { useNavigationGuard } from '@/hooks/useNavigationGuard';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Animated,
  Image,
  PanResponder,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function ItemDetailScreen() {
  const { selectedItem } = useSelectedItem();
  const { validateAndNavigate } = useNavigationGuard();
  const { isLender } = useLender();
  const { lenderId, lenderName, lenderAvatar } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'description' | 'review'>('description');
  const [showMore, setShowMore] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  
  // Animation value for swipe gestures
  const pan = useRef(new Animated.ValueXY()).current;
  
  // Use selected item data if available, otherwise use default data
  const item = selectedItem || {
    id: '1',
    name: 'Canon EOS 90D DSLR Camera',
    price: 2500,
    rating: 4.76,
    location: 'Cebu City',
    category: 'camera'
  };
  
  // Mock images for demonstration - in real app this would come from the item data
  const itemImages = [
    'https://picsum.photos/400/300?random=1',
    'https://picsum.photos/400/300?random=2',
    'https://picsum.photos/400/300?random=3',
    'https://picsum.photos/400/300?random=4',
    'https://picsum.photos/400/300?random=5',
  ];
  
  // Check if description is long enough to show "Show more" button
  const descriptionText = "Capture high-resolution photos and 4K video with this versatile DSLR. Perfect for events, travel, or content creation. Rent it for a day or a week — no strings attached.";
  const isDescriptionLong = descriptionText.length > 100; // Show button if description is longer than 100 characters

  const handleRent = () => {
    // Show communication options modal instead of direct navigation
    setShowCommunicationModal(true);
  };

  const handleVideoCall = () => {
    setShowCommunicationModal(false);
    // Navigate to video call screen
    router.push('/video-call' as any);
  };

  const handleMessageLender = () => {
    setShowCommunicationModal(false);
    
    // Check if user is a lender or renter to route to appropriate interface
    if (isLender) {
      // For lenders: Navigate to lender messages interface
      router.push({
        pathname: '/lender-messages',
        params: { 
          itemId: selectedItem?.id,
          itemName: selectedItem?.name,
          lenderId: lenderId as string || selectedItem?.lenderId || 'lender-123',
          lenderName: lenderName as string || selectedItem?.lenderName || 'Item Owner',
          lenderAvatar: lenderAvatar as string || selectedItem?.lenderAvatar || ''
        }
      });
    } else {
      // For renters: Navigate to view-messages with renter perspective
      router.push({
        pathname: '/view-messages',
        params: { 
          messageId: selectedItem?.id || 'new-conversation',
          senderName: lenderName as string || selectedItem?.lenderName || 'Item Owner',
          itemName: selectedItem?.name || 'Item',
          itemId: selectedItem?.id || 'item1',
          isLenderView: 'false',
          requestStatus: 'pending',
          hasReplied: 'false'
        }
      });
    }
  };

  const handleShowMore = () => {
    setShowMore(!showMore);
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
        pan.setValue({ x: gestureState.dx, y: 0 });
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
        
        // Reset pan value
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Header */}
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₱{item.price}</Text>
            <Text style={styles.rentalPeriod}>for a day</Text>
          </View>
        </View>

        {/* Product Image/Carousel Section */}
        <View style={styles.imageSection}>
          <View style={styles.imageCarousel}>
            {/* Main Image Display */}
            <View style={styles.mainImageContainer}>
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
                <Ionicons name="chevron-back" size={24} color={Colors.text.inverse} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.navArrow, styles.rightArrow]} 
                onPress={nextImage}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-forward" size={24} color={Colors.text.inverse} />
              </TouchableOpacity>
              
              {/* Image Counter */}
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {currentImageIndex + 1} of {itemImages.length}
                </Text>
              </View>
            </View>
          </View>
          
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
          
          {/* Thumbnail Preview */}
          <View style={styles.thumbnailContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailScroll}
            >
              {itemImages.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.thumbnail,
                    index === currentImageIndex && styles.activeThumbnail
                  ]}
                  onPress={() => goToImage(index)}
                  activeOpacity={0.7}
                >
                  <Image 
                    source={{ uri: image }} 
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Tabs Section */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'description' && styles.activeTab]} 
            onPress={() => setActiveTab('description')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'description' && styles.activeTabText]}>
              Description
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'review' && styles.activeTab]} 
            onPress={() => setActiveTab('review')}
            activeOpacity={0.7}
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
            {isDescriptionLong && (
              <TouchableOpacity style={styles.showMoreButton} onPress={handleShowMore} activeOpacity={0.7}>
                <Text style={styles.showMoreText}>Show more</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Review Content */}
        {activeTab === 'review' && (
          <View style={styles.reviewContent}>
            {/* Review Summary */}
            <View style={styles.reviewSummary}>
              <Text style={styles.reviewSummaryText}>★ {item.rating} · 12 reviews</Text>
            </View>

            {/* Individual Reviews */}
            <View style={styles.reviewsList}>
              {/* First Review */}
              <View style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                                     <View style={styles.starsRow}>
                     <Ionicons name="star" size={16} color="#FFD700" />
                     <Ionicons name="star" size={16} color="#FFD700" />
                     <Ionicons name="star" size={16} color="#FFD700" />
                     <Ionicons name="star" size={16} color="#FFD700" />
                     <Ionicons name="star" size={16} color="#FFD700" />
                   </View>
                  <Text style={styles.reviewDate}>January 12, 2025</Text>
                </View>
                <Text style={styles.reviewText}>
                  The camera was in excellent condition and worked flawlessly throughout a 4-day shoot. Batteries were fully charged, lenses were clean, and everything came in a padded case — very professional setup. Setup w...
                </Text>
                <TouchableOpacity style={styles.showMoreLink} activeOpacity={0.7}>
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
                     <Ionicons name="star" size={16} color="#FFD700" />
                     <Ionicons name="star" size={16} color="#FFD700" />
                     <Ionicons name="star" size={16} color="#FFD700" />
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
            <TouchableOpacity style={styles.showAllReviewsButton} activeOpacity={0.7}>
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
                 <Ionicons name="star" size={16} color="#FFD700" />
                 <Ionicons name="star" size={16} color="#FFD700" />
                 <Ionicons name="star" size={16} color="#FFD700" />
                 <Ionicons name="star" size={16} color="#FFD700" />
                 <Ionicons name="star" size={16} color="#FFD700" />
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
              <TouchableOpacity style={styles.ownerChatIcon} onPress={() => router.push({
                pathname: '/(tabs)/messages',
                params: {
                  openConversation: 'true',
                  itemId: '1',
                  itemName: 'Canon EOS 90D DSLR Camera',
                  ownerName: 'Lorenz Aguirre',
                  ownerLocation: 'Cebu City'
                }
              })} activeOpacity={0.7}>
                <Ionicons name="chatbubble-outline" size={20} color={Colors.primary[500]} />
              </TouchableOpacity>
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
          <Text style={styles.actionBarPeriod}>for a day</Text>
        </View>
        <TouchableOpacity style={styles.rentButton} onPress={handleRent} activeOpacity={0.7}>
          <Text style={styles.rentButtonText}>Rent</Text>
        </TouchableOpacity>
      </View>

      {/* Communication Modal */}
      {showCommunicationModal && (
        <View style={styles.communicationModalOverlay}>
          <View style={styles.communicationModalContent}>
            <Text style={styles.communicationModalTitle}>Communication Options</Text>
            <TouchableOpacity style={styles.communicationOption} onPress={handleVideoCall} activeOpacity={0.7}>
              <Ionicons name="videocam-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.communicationOptionText}>Video Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.communicationOption} onPress={handleMessageLender} activeOpacity={0.7}>
              <Ionicons name="chatbubble-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.communicationOptionText}>Message Lender</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.communicationOption} onPress={() => setShowCommunicationModal(false)} activeOpacity={0.7}>
              <Ionicons name="close-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.communicationOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    alignSelf: 'center',
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
    justifyContent: 'space-between',
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
    flex: 1,
  },
  ownerChatIcon: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  actionButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  imageCarousel: {
    width: '100%',
    height: 250, // Fixed height for the carousel
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    position: 'relative',
  },
  mainImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  navArrow: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 10,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  imageCounterText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  thumbnailContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  thumbnailScroll: {
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeThumbnail: {
    borderColor: Colors.primary[500],
    borderWidth: 2,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  // Communication Modal Styles
  communicationModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  communicationModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  communicationModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  communicationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  communicationOptionText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 10,
    fontWeight: '500',
  },
});
