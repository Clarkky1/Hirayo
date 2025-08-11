import { Stack } from 'expo-router';
import React from 'react';
import { ReviewOrderScreen } from '../components/review-order';

export default function ReviewOrder() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Review Order',
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <ReviewOrderScreen />
    </>
  );
}
