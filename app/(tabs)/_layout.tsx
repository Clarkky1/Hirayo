import { LenderDrawer } from '@/components/ui';
import { useLender } from '@/contexts/LenderContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { LogBox, Platform, TouchableOpacity, View } from 'react-native';

LogBox.ignoreAllLogs(true);


export default function TabLayout() {
  const { hasClickedGetStarted } = useLender();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  return (
    <>
      <StatusBar style="light" />
      <View style={{ backgroundColor: '#667EEA', height: 0 }} />
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#667EEA',
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#667EEA',
        },
        headerTintColor: '#ffffff',
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: '#ffffff',
            borderTopWidth: 0.5,
            borderTopColor: '#E0E0E0',
            paddingBottom: 40,
            paddingTop: 5,
          },
          default: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0.5,
            borderTopColor: '#E0E0E0',
            paddingBottom: 40,
            paddingTop: 5,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="search" size={20} color={color} />,
          headerRight: hasClickedGetStarted ? () => (
            <TouchableOpacity 
              style={{ marginRight: 16 }}
              onPress={() => setIsDrawerOpen(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : undefined,
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
    
    {/* Lender Drawer */}
    <LenderDrawer 
      isVisible={isDrawerOpen} 
      onClose={() => setIsDrawerOpen(false)} 
    />
    </>
  );
}
