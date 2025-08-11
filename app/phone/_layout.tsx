import { Stack } from 'expo-router';
import React from 'react';
import PhoneScreen from './PhoneScreen';

export default function PhoneLayout() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Smartphones & Phones',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <PhoneScreen />
    </>
  );
}
