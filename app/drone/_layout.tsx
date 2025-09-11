import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
import DroneScreen from './DroneScreen';

LogBox.ignoreAllLogs(true);


export default function DroneLayout() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Drones & UAVs',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#667EEA',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <DroneScreen />
    </>
  );
}
