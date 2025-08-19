import LendersMessagesScreen from '@/components/lenders-messages';
import { Stack } from 'expo-router';

export default function LendersMessagesRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Messages',
          headerStyle: {
            backgroundColor: '#0066CC', // Blue background
          },
          headerTintColor: '#ffffff', // White text
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      <LendersMessagesScreen />
    </>
  );
}



