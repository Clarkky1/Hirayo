import { Stack } from 'expo-router';
import React from 'react';
import { ItemDetailScreen } from '../components/item';

export default function Item() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Item Details',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <ItemDetailScreen />
    </>
  );
}
