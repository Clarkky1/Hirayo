import { Stack } from 'expo-router';
import React from 'react';
import CameraScreen from './CameraScreen';

export default function CameraLayout() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Camera & Photography',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <CameraScreen />
    </>
  );
}
