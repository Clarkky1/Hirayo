import { Stack } from 'expo-router';
import React from 'react';
import { RentalPeriodScreen } from '../components/period';

export default function Period() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Rental Period',
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <RentalPeriodScreen />
    </>
  );
}
