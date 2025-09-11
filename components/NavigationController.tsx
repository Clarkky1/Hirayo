import { Colors } from '@/constants/DesignSystem';
import { useAuthState } from '@/contexts/AuthStateContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function NavigationController() {
  const { isFirstTime, isAuthenticated, isLoading } = useAuthState();
  const { user, loading: authLoading } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't navigate while loading
    if (isLoading || authLoading) return;

    // Check if user is actually authenticated with Supabase
    const isActuallyAuthenticated = user !== null;

    if (isFirstTime) {
      // First time user - show onboarding
      router.replace('/onboarding');
    } else if (isActuallyAuthenticated) {
      // User is logged in - go to home
      router.replace('/(tabs)');
    } else {
      // User is not logged in - go to login
      router.replace('/login');
    }
  }, [isFirstTime, isAuthenticated, user, isLoading, authLoading, router]);

  // Show loading screen while determining navigation
  if (isLoading || authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary[500]} />
      </View>
    );
  }

  // This component doesn't render anything as it only handles navigation
  return null;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
  },
});
