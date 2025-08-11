import { Stack } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Test() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Test Page',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>This is a test page</Text>
        <TouchableOpacity onPress={() => console.log('Test button pressed')}>
          <Text>Test Button</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
