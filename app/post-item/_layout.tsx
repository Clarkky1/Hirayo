import { Stack } from 'expo-router';
import React from 'react';
import PostItemScreen from './PostItemScreen';

export default function PostItemLayout() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Post Item',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <PostItemScreen />
    </>
  );
}
