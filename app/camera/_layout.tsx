import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
import CameraScreen from './CameraScreen';

LogBox.ignoreAllLogs(true);


export default function CameraLayout() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Camera & Photography',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#667EEA',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <CameraScreen />
    </>
  );
}
