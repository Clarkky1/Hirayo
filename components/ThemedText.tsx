import { StyleSheet, Text, type TextProps } from 'react-native';

import { TextStyles } from '@/constants/DesignSystem';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'caption' | 'button';
  variant?: 'display' | 'heading' | 'body' | 'caption' | 'button' | 'link';
  size?: 'large' | 'medium' | 'small';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  variant,
  size = 'medium',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const getTextStyle = () => {
    if (variant && size) {
      return TextStyles[variant][size];
    }
    
    switch (type) {
      case 'title':
        return TextStyles.heading.h1;
      case 'subtitle':
        return TextStyles.heading.h2;
      case 'defaultSemiBold':
        return TextStyles.body.medium;
      case 'link':
        return TextStyles.link;
      case 'default':
      default:
        return TextStyles.body.medium;
    }
  };

  const textStyle = getTextStyle();

  return (
    <Text
      style={[
        textStyle,
        { color: lightColor || darkColor || color },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    ...TextStyles.body.medium,
  },
  defaultSemiBold: {
    ...TextStyles.body.medium,
    fontWeight: '600',
  },
  title: {
    ...TextStyles.heading.h1,
  },
  subtitle: {
    ...TextStyles.heading.h2,
  },
  link: {
    ...TextStyles.link,
  },
});
