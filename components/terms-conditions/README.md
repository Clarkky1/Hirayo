# Terms & Conditions Component

## Overview
The `TermsConditionsScreen` component displays the terms and conditions for the Hirayo rental platform.

## Features
- **Comprehensive Terms**: Covers all essential legal aspects of the platform
- **Structured Layout**: Organized into numbered sections for easy reading
- **Responsive Design**: Scrollable content with proper spacing and typography
- **Professional Styling**: Uses the app's design system for consistency

## Structure
The terms and conditions include the following sections:
1. Acceptance of Terms
2. Description of Service
3. User Responsibilities
4. Rental Agreements
5. Payment and Fees
6. Prohibited Activities
7. Limitation of Liability
8. Privacy Policy
9. Modifications to Terms
10. Contact Information

## Usage
```tsx
import TermsConditionsScreen from '@/components/terms-conditions/TermsConditionsScreen';

// Use in a route
<Stack.Screen name="terms-conditions" options={{ headerShown: false }} />
```

## Navigation
- **Route**: `/terms-conditions`
- **Header**: "Terms & Conditions" (configurable in layout)
- **Access**: Can be linked from various parts of the app (e.g., signup, settings)

## Styling
- Uses the app's design system constants
- Responsive layout with proper spacing
- Scrollable content for mobile devices
- Consistent typography and colors
