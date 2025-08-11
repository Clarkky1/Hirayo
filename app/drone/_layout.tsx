import { Stack } from 'expo-router';
import React from 'react';
import DroneScreen from './DroneScreen';

export default function DroneLayout() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Drones & UAVs',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <DroneScreen />
    </>
  );
}
