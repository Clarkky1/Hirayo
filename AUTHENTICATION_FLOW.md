# Authentication Flow

This document explains how the authentication system works in the Hirayo app.

## Flow Overview

1. **Splash Screen**: Shows the app logo and branding for 3 seconds
2. **Authentication**: After splash, users are directed to login/signup screens
3. **Main App**: After successful authentication, users access the main app

## Components

### SplashScreen (`components/SplashScreen.tsx`)
- Displays app logo and branding
- Shows for 3 seconds with smooth animations
- Provides navigation buttons to Login and Signup screens
- Uses `expo-router` for navigation

### LoginScreen (`components/login/LoginScreen.tsx`)
- Phone number input for authentication
- Social login options (Facebook, Google)
- Navigation to signup screen
- Uses authentication hook for state management

### SignupScreen (`components/signup/SignupScreen.tsx`)
- User registration form (name, DOB, email)
- Navigation back to login screen
- Uses authentication hook for state management

### Authentication Hook (`hooks/useAuth.ts`)
- React Context-based authentication state management
- Provides `login`, `signup`, and `logout` functions
- Manages user authentication state throughout the app

## Navigation Flow

```
Splash Screen (3s) → Login/Signup → Main App
     ↓                    ↓           ↓
  Logo + Buttons    Phone/Form    (tabs) Navigation
```

## Key Features

- **Smooth Transitions**: Animated splash screen with staggered animations
- **Authentication State**: Centralized auth state management
- **Navigation**: Seamless flow between authentication and main app
- **User Experience**: Clear call-to-action buttons and intuitive navigation

## Usage

The authentication system automatically handles:
- User login state persistence
- Navigation between auth screens
- Redirect to main app after successful auth
- Logout functionality from profile screen

## Technical Details

- Built with React Native and Expo Router
- Uses React Context for state management
- Implements proper navigation patterns
- Follows React Native best practices
