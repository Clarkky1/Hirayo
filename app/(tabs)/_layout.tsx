import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0066CC',
        tabBarInactiveTintColor: '#666666',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0066CC',
        },
        headerTintColor: '#ffffff',
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#E0E0E0',
            paddingBottom: 20,
            paddingTop: 10,
          },
          default: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#E0E0E0',
            paddingBottom: 20,
            paddingTop: 10,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="search" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <Ionicons name="heart-outline" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => <Ionicons name="time-outline" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble-outline" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
