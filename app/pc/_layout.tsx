import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
import PCScreen from './PCScreen';

LogBox.ignoreAllLogs(true);


export default function PCLayout() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'PCs & Desktops',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#667EEA',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <PCScreen />
    </>
  );
}
