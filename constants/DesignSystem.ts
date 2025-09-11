import { Platform } from 'react-native';

export const Colors = {
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#0066CC',
    600: '#1976D2',
    700: '#1565C0',
    800: '#0D47A1',
    900: '#0A3D91',
  },
  
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFAFA',
    tertiary: '#F5F5F5',
  },
  
  text: {
    primary: '#1A1A1A',
    secondary: '#424242',
    tertiary: '#757575',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },
  
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#9E9E9E',
  },
};

export const Typography = {
  fontFamily: {
    regular: Platform.select({
      ios: 'Nunito-Regular',
      android: 'Nunito-Regular',
      default: 'Nunito-Regular',
    }),
    medium: Platform.select({
      ios: 'Nunito-Medium',
      android: 'Nunito-Medium',
      default: 'Nunito-Medium',
    }),
    semibold: Platform.select({
      ios: 'Nunito-SemiBold',
      android: 'Nunito-SemiBold',
      default: 'Nunito-SemiBold',
    }),
    bold: Platform.select({
      ios: 'Nunito-Bold',
      android: 'Nunito-Bold',
      default: 'Nunito-Bold',
    }),
  },
  
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 40,
    '4xl': 44,
    '5xl': 56,
  },
  
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
  '6xl': 40,
  '7xl': 44,
  '8xl': 48,
  '9xl': 52,
};

export const BorderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

export const Shadows = {
  xs: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  base: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  primary: {
    shadowColor: '#0066CC',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  // Soft shadow variants with reduced opacity and softer colors
  softXs: {
    shadowColor: '#6B7280',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  softSm: {
    shadowColor: '#6B7280',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  softBase: {
    shadowColor: '#6B7280',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  softLg: {
    shadowColor: '#6B7280',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  softCard: {
    shadowColor: '#9CA3AF',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  softButton: {
    shadowColor: '#9CA3AF',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
};

export const TextStyles = {
  display: {
    large: {
      fontFamily: Typography.fontFamily.bold,
      fontSize: Typography.fontSize['5xl'],
      lineHeight: Typography.lineHeight['5xl'],
      fontWeight: Typography.fontWeight.bold,
      letterSpacing: Typography.letterSpacing.tight,
      color: Colors.text.primary,
    },
    medium: {
      fontFamily: Typography.fontFamily.bold,
      fontSize: Typography.fontSize['4xl'],
      lineHeight: Typography.lineHeight['4xl'],
      fontWeight: Typography.fontWeight.bold,
      letterSpacing: Typography.letterSpacing.tight,
      color: Colors.text.primary,
    },
    small: {
      fontFamily: Typography.fontFamily.bold,
      fontSize: Typography.fontSize['3xl'],
      lineHeight: Typography.lineHeight['3xl'],
      fontWeight: Typography.fontWeight.bold,
      letterSpacing: Typography.letterSpacing.tight,
      color: Colors.text.primary,
    },
  },
  
  heading: {
    h1: {
      fontFamily: Typography.fontFamily.bold,
      fontSize: Typography.fontSize['2xl'],
      lineHeight: Typography.lineHeight['2xl'],
      fontWeight: Typography.fontWeight.bold,
      letterSpacing: Typography.letterSpacing.tight,
      color: Colors.text.primary,
    },
    h2: {
      fontFamily: Typography.fontFamily.semibold,
      fontSize: Typography.fontSize.xl,
      lineHeight: Typography.lineHeight.xl,
      fontWeight: Typography.fontWeight.semibold,
      letterSpacing: Typography.letterSpacing.normal,
      color: Colors.text.primary,
    },
    h3: {
      fontFamily: Typography.fontFamily.semibold,
      fontSize: Typography.fontSize.lg,
      lineHeight: Typography.lineHeight.lg,
      fontWeight: Typography.fontWeight.semibold,
      letterSpacing: Typography.letterSpacing.normal,
      color: Colors.text.primary,
    },
  },
  
  body: {
    large: {
      fontFamily: Typography.fontFamily.regular,
      fontSize: Typography.fontSize.lg,
      lineHeight: Typography.lineHeight.lg,
      fontWeight: Typography.fontWeight.regular,
      letterSpacing: Typography.letterSpacing.normal,
      color: Colors.text.primary,
    },
    medium: {
      fontFamily: Typography.fontFamily.regular,
      fontSize: Typography.fontSize.base,
      lineHeight: Typography.lineHeight.base,
      fontWeight: Typography.fontWeight.regular,
      letterSpacing: Typography.letterSpacing.normal,
      color: Colors.text.primary,
    },
    small: {
      fontFamily: Typography.fontFamily.regular,
      fontSize: Typography.fontSize.sm,
      lineHeight: Typography.lineHeight.sm,
      fontWeight: Typography.fontWeight.regular,
      letterSpacing: Typography.letterSpacing.normal,
      color: Colors.text.secondary,
    },
  },
  
  caption: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.xs,
    fontWeight: Typography.fontWeight.regular,
    letterSpacing: Typography.letterSpacing.wide,
    color: Colors.text.tertiary,
  },
  
  button: {
    large: {
      fontFamily: Typography.fontFamily.semibold,
      fontSize: Typography.fontSize.lg,
      lineHeight: Typography.lineHeight.lg,
      fontWeight: Typography.fontWeight.semibold,
      letterSpacing: Typography.letterSpacing.wide,
      color: Colors.text.inverse,
    },
    medium: {
      fontFamily: Typography.fontFamily.semibold,
      fontSize: Typography.fontSize.base,
      lineHeight: Typography.lineHeight.base,
      fontWeight: Typography.fontWeight.semibold,
      letterSpacing: Typography.letterSpacing.wide,
      color: Colors.text.inverse,
    },
    small: {
      fontFamily: Typography.fontFamily.semibold,
      fontSize: Typography.fontSize.sm,
      lineHeight: Typography.lineHeight.sm,
      fontWeight: Typography.fontWeight.semibold,
      letterSpacing: Typography.letterSpacing.wide,
      color: Colors.text.inverse,
    },
  },
  
  link: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.base,
    lineHeight: Typography.lineHeight.base,
    fontWeight: Typography.fontWeight.medium,
    letterSpacing: Typography.letterSpacing.normal,
    color: Colors.primary[500],
  },
};
