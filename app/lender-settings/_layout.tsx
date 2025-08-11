import { Stack } from 'expo-router';
import React from 'react';

export default function LenderSettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Lender Settings',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
            color: '#FFFFFF',
          },
        }}
      />
    </Stack>
  );
}
