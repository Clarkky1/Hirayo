import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BorderRadius, Colors, Spacing } from '../../constants/DesignSystem';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  margin = 'none',
  style
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: Colors.background.primary,
          borderWidth: 1,
          borderColor: Colors.border.light,
        };
      case 'outlined':
        return {
          backgroundColor: Colors.background.primary,
          borderWidth: 1,
          borderColor: Colors.border.medium,
        };
      case 'filled':
        return {
          backgroundColor: Colors.background.secondary,
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: Colors.background.primary,
          borderWidth: 1,
          borderColor: Colors.border.light,
        };
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return {};
      case 'small':
        return { padding: Spacing.sm };
      case 'large':
        return { padding: Spacing.lg };
      default:
        return { padding: Spacing.md };
    }
  };

  const getMarginStyles = () => {
    switch (margin) {
      case 'none':
        return {};
      case 'small':
        return { margin: Spacing.sm };
      case 'large':
        return { margin: Spacing.lg };
      default:
        return { margin: Spacing.md };
    }
  };

  return (
    <View
      style={[
        styles.base,
        getVariantStyles(),
        getPaddingStyles(),
        getMarginStyles(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
});
