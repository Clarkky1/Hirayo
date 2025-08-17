import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, TextStyles } from '../../constants/DesignSystem';

export interface ProductCardProps {
  item: {
    id: string;
    name: string;
    price: number;
    rating: number;
    location: string;
    image?: string;
  };
  onPress: () => void;
  onFavoritePress?: () => void;
  onChatPress?: () => void;
  showFavoriteIcon?: boolean;
  showChatIcon?: boolean;
  variant?: 'default' | 'compact' | 'large';
  style?: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onPress,
  onFavoritePress,
  onChatPress,
  showFavoriteIcon = true,
  showChatIcon = false,
  variant = 'default',
  style
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          card: styles.cardCompact,
          image: styles.imageCompact,
          details: styles.detailsCompact,
          name: styles.nameCompact,
          price: styles.priceCompact,
        };
      case 'large':
        return {
          card: styles.cardLarge,
          image: styles.imageLarge,
          details: styles.detailsLarge,
          name: styles.nameLarge,
          price: styles.priceLarge,
        };
      default:
        return {
          card: styles.cardDefault,
          image: styles.imageDefault,
          details: styles.detailsDefault,
          name: styles.nameDefault,
          price: styles.priceDefault,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity 
      style={[variantStyles.card, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={variantStyles.image}>
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
              onFavoritePress?.();
            }}
          >
            <Ionicons name="heart-outline" size={16} color={Colors.neutral[600]} />
          </TouchableOpacity>
        )}
        
        {showChatIcon && (
          <TouchableOpacity 
            style={styles.chatIcon}
            onPress={(e) => {
              e.stopPropagation();
              onChatPress?.();
            }}
          >
            <Ionicons name="chatbubble-outline" size={16} color={Colors.primary[500]} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={variantStyles.details}>
        <Text style={variantStyles.name} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        
        <Text style={styles.locationText}>{item.location}</Text>
        
        <Text style={variantStyles.price}>
          ₱{item.price.toLocaleString()} 
          <Text style={styles.perDayText}> for a day</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Default variant
  cardDefault: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    width: '48%',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  imageDefault: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.neutral[300],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  detailsDefault: {
    padding: Spacing.md,
    flex: 1,
    justifyContent: 'space-between',
  },
  nameDefault: {
    ...TextStyles.body.small,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
    color: Colors.text.primary,
    lineHeight: 18,
  },
  priceDefault: {
    ...TextStyles.body.small,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: Spacing.xs,
  },

  // Compact variant
  cardCompact: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border.light,
    flexDirection: 'row',
  },
  imageCompact: {
    width: 80,
    height: 80,
    backgroundColor: Colors.neutral[300],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  detailsCompact: {
    padding: Spacing.sm,
    flex: 1,
    justifyContent: 'space-between',
  },
  nameCompact: {
    ...TextStyles.body.small,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
    color: Colors.text.primary,
  },
  priceCompact: {
    ...TextStyles.body.small,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },

  // Large variant
  cardLarge: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  imageLarge: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.neutral[300],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  detailsLarge: {
    padding: Spacing.lg,
    flex: 1,
    justifyContent: 'space-between',
  },
  nameLarge: {
    ...TextStyles.body.medium,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  priceLarge: {
    ...TextStyles.body.medium,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: Spacing.sm,
  },

  // Common styles
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
  locationText: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  perDayText: {
    fontWeight: 'normal',
    color: Colors.text.secondary,
  },
});
