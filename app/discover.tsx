import { Stack } from 'expo-router';
import React from 'react';
import { DiscoverScreen } from '../components/discover';

export default function Discover() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Discover',
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <DiscoverScreen />
    </>
  );
}
