import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
import LaptopScreen from './LaptopScreen';

LogBox.ignoreAllLogs(true);


export default function LaptopLayout() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Laptops & Computers',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <LaptopScreen />
    </>
  );
}
