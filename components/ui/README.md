# UI Components

This folder contains reusable UI components that provide consistent styling and behavior across the application.

## Components

### ProductCard

A reusable product card component with multiple variants and no shadows. Best for grid layouts like the discover page.

**Props:**
- `item`: Product data object with id, name, price, rating, location, and optional image
- `onPress`: Function called when the card is pressed
- `onFavoritePress`: Optional function for favorite button
- `onChatPress`: Optional function for chat button
- `showFavoriteIcon`: Boolean to show/hide favorite icon (default: true)
- `showChatIcon`: Boolean to show/hide chat icon (default: false)
- `variant`: Card variant - 'default', 'compact', or 'large' (default: 'default')
- `style`: Additional styles to apply

**Usage:**
```tsx
import { ProductCard } from '../ui/ProductCard';

<ProductCard
  item={productData}
  onPress={() => handleProductPress(productData)}
  onChatPress={() => handleChatPress(productData)}
  showFavoriteIcon={true}
  showChatIcon={true}
  variant="default"
/>
```

### WideCard

A wide card component designed for home page sections (explore, popular) with horizontal scrolling. Features no shadows, clean borders, and fixed width for consistent horizontal layouts.

**Props:**
- `item`: Product data object with id, name, price, rating, location, and optional image
- `onPress`: Function called when the card is pressed
- `onFavoritePress`: Optional function for favorite button
- `onChatPress`: Optional function for chat button
- `showFavoriteIcon`: Boolean to show/hide favorite icon (default: true)
- `showChatIcon`: Boolean to show/hide chat icon (default: false)
- `style`: Additional styles to apply

**Usage:**
```tsx
import { WideCard } from '../ui/WideCard';

<WideCard
  item={productData}
  onPress={() => handleProductPress(productData)}
  onChatPress={() => handleChatPress(productData)}
  showFavoriteIcon={true}
  showChatIcon={true}
/>
```

### Card

A general-purpose card component with multiple variants and no shadows.

**Props:**
- `children`: Content to display inside the card
- `variant`: Card style variant - 'default', 'elevated', 'outlined', or 'filled' (default: 'default')
- `padding`: Padding size - 'none', 'small', 'medium', or 'large' (default: 'medium')
- `margin`: Margin size - 'none', 'small', 'medium', or 'large' (default: 'none')
- `style`: Additional styles to apply

**Usage:**
```tsx
import { Card } from '../ui/Card';

<Card variant="filled" padding="large">
  <Text>Card content here</Text>
</Card>
```

## Benefits

1. **No Shadows**: All components use borders instead of shadows for a flat, modern design
2. **Consistent Styling**: Unified design system across all screens
3. **Easy Maintenance**: Update styles in one place to affect all instances
4. **Flexible Variants**: Multiple styling options for different use cases
5. **Type Safety**: Full TypeScript support with proper interfaces

## Migration

To migrate existing cards to use these components:

1. Replace custom card implementations with `ProductCard` or `Card`
2. Remove shadow-related styles from existing components
3. Use the appropriate variant and padding options
4. Update imports to use the new components

## Design System

These components use the centralized design system from `constants/DesignSystem.ts`:
- Colors
- Spacing
- BorderRadius
- TextStyles

All styling is consistent with the app's design language.
