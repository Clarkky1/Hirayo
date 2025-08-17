import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BorderRadius, Colors, Spacing, TextStyles } from '../../constants/DesignSystem';

export interface WideCardProps {
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
  showFavoriteIcon?: boolean;
  style?: any;
}

export const WideCard: React.FC<WideCardProps> = ({
  item,
  onPress,
  onFavoritePress,
  showFavoriteIcon = true,
  style
}) => {
  return (
    <TouchableOpacity 
      style={[styles.card, style]} 
      onPress={onPress}
      activeOpacity={0.7}
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
              onFavoritePress?.();
            }}
          >
            <Ionicons name="heart-outline" size={16} color={Colors.neutral[600]} />
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
          <Text style={styles.ownerLabel}>Owner:</Text>
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerLocation}>{item.location}</Text>
          </View>
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
  ownerLabel: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ownerLocation: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    flex: 1,
  },

  perDayText: {
    fontWeight: 'normal',
    color: Colors.text.secondary,
  },
});
