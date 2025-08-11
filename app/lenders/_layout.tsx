import { Stack } from 'expo-router';
import React from 'react';

export default function LendersLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Lenders',
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
