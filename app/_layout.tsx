import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import SplashScreen from '@/components/SplashScreen';
import { LenderProvider } from '@/contexts/LenderContext';
import { RentalFlowProvider } from '@/contexts/RentalFlowContext';
import { SavedItemsProvider } from '@/contexts/SavedItemsContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { SelectedItemProvider } from '@/contexts/SelectedItemContext';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import { UserProvider } from '@/contexts/UserContext';
import { AuthProvider } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(true);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Medium': Nunito_500Medium,
    'Nunito-SemiBold': Nunito_600SemiBold,
    'Nunito-Bold': Nunito_700Bold,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!loaded) {
    return null;
  }

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <SupabaseAuthProvider>
      <AuthProvider>
        <UserProvider>
          <SearchProvider>
            <SavedItemsProvider>
              <SelectedItemProvider>
                <LenderProvider>
                  <RentalFlowProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack initialRouteName="onboarding">
                  <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                  <Stack.Screen name="login" options={{ headerShown: false }} />
                  <Stack.Screen name="signup" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="lenders" options={{ headerShown: false }} />
                  <Stack.Screen name="lender-messages" options={{ headerShown: false }} />
                  <Stack.Screen name="my-items" options={{ headerShown: false }} />
                  <Stack.Screen name="lender-settings" options={{ headerShown: false }} />
                  <Stack.Screen name="analytics" options={{ headerShown: false }} />
                  <Stack.Screen name="earnings" options={{ headerShown: false }} />
                  <Stack.Screen name="personal-information" options={{ headerShown: false }} />
                  <Stack.Screen name="post-item" options={{ headerShown: false }} />
                  <Stack.Screen name="payment-methods" options={{ headerShown: false }} />
                  <Stack.Screen name="notifications" options={{ headerShown: false }} />
                  <Stack.Screen name="privacy-security" options={{ headerShown: false }} />
                  <Stack.Screen name="help-support" options={{ headerShown: false }} />
                  <Stack.Screen name="about" options={{ headerShown: false }} />
                  <Stack.Screen name="terms-conditions" options={{ headerShown: false }} />
                  <Stack.Screen name="view-messages" options={{ headerShown: false }} />
                  <Stack.Screen name="pay" options={{ headerShown: false }} />
                  <Stack.Screen name="camera" options={{ headerShown: false }} />
                  <Stack.Screen name="laptop" options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="light" />
      <View style={{ backgroundColor: '#667EEA', height: 0 }} />
              </ThemeProvider>
                  </RentalFlowProvider>
                </LenderProvider>
              </SelectedItemProvider>
            </SavedItemsProvider>
          </SearchProvider>
        </UserProvider>
      </AuthProvider>
    </SupabaseAuthProvider>
  );
}
