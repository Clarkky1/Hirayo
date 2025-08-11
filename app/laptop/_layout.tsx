import { Stack } from 'expo-router';
import React from 'react';
import LaptopScreen from './LaptopScreen';

export default function LaptopLayout() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Laptops & Computers',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <LaptopScreen />
    </>
  );
}
