import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
import PhoneScreen from './PhoneScreen';

LogBox.ignoreAllLogs(true);


export default function PhoneLayout() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Smartphones & Phones',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#667EEA',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <PhoneScreen />
    </>
  );
}
