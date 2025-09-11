import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, TextStyles } from '../../constants/DesignSystem';
import { SavedItem, useSavedItems } from '../../contexts/SavedItemsContext';

export interface WideCardProps {
  item: {
    id: string;
    name: string;
    price: number;
    rating: number;
    location: string;
    image?: string;
    ownerName?: string;
    ownerAvatar?: string;
    category?: string;
    description?: string;
  };
  onPress: () => void;
  showFavoriteIcon?: boolean;
  style?: any;
}

export const WideCard: React.FC<WideCardProps> = ({
  item,
  onPress,
  showFavoriteIcon = true,
  style
}) => {
  const { addSavedItem, removeSavedItem, isItemSaved } = useSavedItems();
  const [isNavigating, setIsNavigating] = useState(false);
  
  const handleFavoritePress = () => {
    if (isItemSaved(item.id)) {
      removeSavedItem(item.id);
    } else {
      const savedItem: SavedItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        rating: item.rating,
        location: item.location,
        image: item.image,
        category: item.category,
        description: item.description,
        ownerName: item.ownerName,
        ownerAvatar: item.ownerAvatar,
      };
      addSavedItem(savedItem);
    }
  };

  const handleItemPress = async () => {
    if (isNavigating) return; // Prevent multiple clicks
    
    setIsNavigating(true);
    
    try {
      await onPress();
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      // Reset after a short delay to allow navigation to complete
      setTimeout(() => setIsNavigating(false), 1000);
    }
  };
  return (
    <TouchableOpacity 
      style={[styles.card, style, isNavigating && styles.disabledCard]} 
      onPress={handleItemPress}
      activeOpacity={isNavigating ? 1 : 0.7}
      disabled={isNavigating}
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.productImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={24} color={Colors.neutral[400]} />
          </View>
        )}
        
        {showFavoriteIcon && (
          <TouchableOpacity 
            style={styles.favoriteIcon}
            onPress={(e) => {
              e.stopPropagation();
              handleFavoritePress();
            }}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isItemSaved(item.id) ? "heart" : "heart-outline"} 
              size={16} 
              color={isItemSaved(item.id) ? Colors.primary[500] : Colors.neutral[600]} 
            />
          </TouchableOpacity>
        )}
        

      </View>
      
      <View style={styles.details}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        
        <View style={styles.ownerSection}>
          <View style={styles.ownerRow}>
            <Text style={styles.ownerLabel}>Owner: </Text>
            <Text style={styles.ownerName}>{item.ownerName || 'Unknown Owner'}</Text>
          </View>
          <Text style={styles.ownerLocation}>{item.location}</Text>
        </View>
        
        <Text style={styles.priceText}>
          ₱{item.price.toLocaleString()} 
          <Text style={styles.perDayText}> for a day</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    width: 240,
    borderWidth: 1,
    borderColor: Colors.border.light,
    marginBottom: Spacing.md,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.neutral[300],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  details: {
    padding: Spacing.md,
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    ...TextStyles.body.small,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
    color: Colors.text.primary,
    lineHeight: 18,
  },
  priceText: {
    ...TextStyles.body.small,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: Spacing.xs,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  chatIcon: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.full,
    padding: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  ratingText: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
  },
  ownerSection: {
    marginBottom: Spacing.xs,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  ownerLabel: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  ownerName: {
    ...TextStyles.caption,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  ownerLocation: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
  },

  perDayText: {
    fontWeight: 'normal',
    color: Colors.text.secondary,
  },
  disabledCard: {
    opacity: 0.6,
  },
});
