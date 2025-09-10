import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
import AudioScreen from './AudioScreen';

LogBox.ignoreAllLogs(true);


export default function AudioLayout() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Audio & Headphones',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <AudioScreen />
    </>
  );
}
