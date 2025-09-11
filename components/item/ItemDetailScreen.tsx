import { BorderRadius, Colors, Spacing } from '@/constants/DesignSystem';
import { useLender } from '@/contexts/LenderContext';
import { useSelectedItem } from '@/contexts/SelectedItemContext';
import { useNavigationGuard } from '@/hooks/useNavigationGuard';
import { Item } from '@/lib/supabase';
import { itemsService } from '@/services/itemsService';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
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
  const { itemId, lenderName, lenderId, lenderAvatar } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'description' | 'review'>('description');
  const [showMore, setShowMore] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Animation value for swipe gestures
  const pan = useRef(new Animated.ValueXY()).current;
  
  // Load item data
  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        const itemIdToLoad = itemId as string || selectedItem?.id;
        
        if (!itemIdToLoad) {
          setError('No item ID provided');
          return;
        }

        const { data, error: itemError } = await itemsService.getItemById(itemIdToLoad);
        
        if (itemError) {
          throw itemError;
        }

        setItem(data);
      } catch (err) {
        console.error('Error loading item:', err);
        setError('Failed to load item details');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [itemId, selectedItem?.id]);
  
  // Use item images from data or fallback
  const itemImages = item?.images && item.images.length > 0 
    ? item.images 
    : ['https://picsum.photos/400/300?random=1'];
  
  // Check if description is long enough to show "Show more" button
  const descriptionText = item?.description || "No description available";
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
          lenderId: item?.lender_id || 'lender-123',
          lenderName: item?.lender ? `${item.lender.first_name} ${item.lender.last_name}` : 'Item Owner',
          lenderAvatar: item?.lender?.avatar_url || ''
        }
      });
    } else {
      // For renters: Navigate to view-messages with renter perspective
      router.push({
        pathname: '/view-messages',
        params: { 
          messageId: selectedItem?.id || 'new-conversation',
          senderName: item?.lender ? `${item.lender.first_name} ${item.lender.last_name}` : 'Item Owner',
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

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={{ backgroundColor: '#667EEA', height: 0 }} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading item details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !item) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={{ backgroundColor: '#667EEA', height: 0 }} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
          <Text style={styles.errorText}>{error || 'Item not found'}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={{ backgroundColor: '#667EEA', height: 0 }} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Header */}
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₱{item.price_per_day}</Text>
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
              {item?.description || "No description available"}
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
              <Text style={styles.reviewSummaryText}>★ {item?.rating || 0} · No reviews yet</Text>
            </View>

            {/* Individual Reviews */}
            <View style={styles.reviewsList}>
              {item?.rating && item.rating > 0 ? (
                <View style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.starsRow}>
                      {[...Array(5)].map((_, index) => (
                        <Ionicons 
                          key={index}
                          name="star" 
                          size={16} 
                          color={index < Math.floor(item.rating) ? "#FFD700" : "#E0E0E0"} 
                        />
                      ))}
                    </View>
                    <Text style={styles.reviewDate}>Recently</Text>
                  </View>
                  <Text style={styles.reviewText}>
                    This item has a rating of {item.rating} stars. Be the first to leave a review after renting this item!
                  </Text>
                  <View style={styles.reviewerInfo}>
                    <View style={styles.reviewerAvatar} />
                    <Text style={styles.reviewerName}>System</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.noReviewsContainer}>
                  <Ionicons name="star-outline" size={48} color="#E0E0E0" />
                  <Text style={styles.noReviewsText}>No reviews yet</Text>
                  <Text style={styles.noReviewsSubtext}>Be the first to review this item after renting it!</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Statistics/Metrics Section - Only show in description tab */}
        {activeTab === 'description' && (
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{item?.rating || 0}</Text>
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
              <View style={styles.ownerAvatar}>
                {item?.lender?.avatar_url ? (
                  <Image source={{ uri: item.lender.avatar_url }} style={styles.ownerAvatarImage} />
                ) : (
                  <Ionicons name="person" size={20} color={Colors.text.secondary} />
                )}
              </View>
              <Text style={styles.ownerName}>
                {item?.lender ? `${item.lender.first_name} ${item.lender.last_name}` : 'Item Owner'}
              </Text>
              <TouchableOpacity style={styles.ownerChatIcon} onPress={() => router.push({
                pathname: '/(tabs)/messages',
                params: {
                  openConversation: 'true',
                  itemId: item?.id || '1',
                  itemName: item?.name || 'Item',
                  ownerName: item?.lender ? `${item.lender.first_name} ${item.lender.last_name}` : 'Item Owner',
                  ownerLocation: item?.location || 'Unknown Location'
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
          <Text style={styles.actionBarPrice}>₱{item?.price_per_day?.toLocaleString() || '0'}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownerAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  noReviewsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noReviewsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
  },
  noReviewsSubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    marginTop: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
});
