# Hirayo App - Clean Folder Structure

This document outlines the organized and clean folder structure for the Hirayo rental app.

## 📁 Root Structure

```
hirayo/
├── app/                    # Expo Router app directory
├── assets/                 # Static assets (images, fonts, etc.)
├── components/             # Legacy components (to be migrated)
├── constants/              # App constants and design system
├── features/               # Feature-based organization
├── hooks/                  # Custom React hooks
├── screens/                # Screen components
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
├── scripts/                # Build and utility scripts
└── docs/                   # Documentation files
```

## 🎯 Features Directory

The `features/` directory organizes code by business features:

```
features/
├── auth/                   # Authentication feature
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   └── index.ts
├── home/                   # Home screen feature
│   ├── HomeScreen.tsx
│   └── index.ts
├── ui/                     # Reusable UI components
│   ├── ThemedText.tsx
│   ├── ThemedView.tsx
│   └── index.ts
└── index.ts                # Main features export
```

## 🖼️ Screens Directory

The `screens/` directory contains all screen components:

```
screens/
├── SplashScreen.tsx
└── index.ts
```

## 🔧 Utils Directory

The `utils/` directory contains common utility functions:

```
utils/
├── index.ts               # Date, currency, validation, etc.
```

## 📝 Types Directory

The `types/` directory contains TypeScript type definitions:

```
types/
├── index.ts               # User, Item, Rental, Message types
```

## 📦 Import Structure

### Feature Imports
```typescript
// Import from specific feature
import { LoginScreen, SignupScreen } from '@/features/auth';
import { HomeScreen } from '@/features/home';
import { ThemedText, ThemedView } from '@/features/ui';
```

### Screen Imports
```typescript
// Import screens
import { SplashScreen } from '@/screens';
```

### Utility Imports
```typescript
// Import utilities
import { formatDate, formatCurrency, isValidEmail } from '@/utils';
```

### Type Imports
```typescript
// Import types
import { User, Item, Rental } from '@/types';
```

## 🚀 Benefits of This Structure

1. **Feature-Based Organization**: Related code is grouped together
2. **Clear Separation**: UI components, screens, and utilities are clearly separated
3. **Easy Navigation**: Developers can quickly find related code
4. **Scalable**: Easy to add new features without cluttering existing code
5. **Maintainable**: Clear structure makes maintenance easier
6. **Import Clarity**: Clean import paths with index files

## 🔄 Migration Path

1. **Phase 1**: Move existing components to appropriate feature folders
2. **Phase 2**: Update import statements throughout the app
3. **Phase 3**: Remove old component files
4. **Phase 4**: Add new features using the new structure

## 📋 Next Steps

- [ ] Move remaining screen components to `screens/`
- [ ] Move device-specific screens to `features/devices/`
- [ ] Move profile-related screens to `features/profile/`
- [ ] Move messaging screens to `features/messaging/`
- [ ] Update all import statements
- [ ] Remove old component files
- [ ] Add comprehensive testing structure
