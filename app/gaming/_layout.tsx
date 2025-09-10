import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
import GamingScreen from './GamingScreen';

LogBox.ignoreAllLogs(true);


export default function GamingLayout() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Gaming & Entertainment',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <GamingScreen />
    </>
  );
}
