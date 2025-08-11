import { Stack } from 'expo-router';
import React from 'react';
import PCScreen from './PCScreen';

export default function PCLayout() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'PCs & Desktops',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <PCScreen />
    </>
  );
}
