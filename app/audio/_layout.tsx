import { Stack } from 'expo-router';
import React from 'react';
import AudioScreen from './AudioScreen';

export default function AudioLayout() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Audio & Headphones',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <AudioScreen />
    </>
  );
}
