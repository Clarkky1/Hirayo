import { Stack } from 'expo-router';
import React from 'react';
import GamingScreen from './GamingScreen';

export default function GamingLayout() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Gaming & Entertainment',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <GamingScreen />
    </>
  );
}
