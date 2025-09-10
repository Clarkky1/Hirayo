import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
import { DiscoverScreen } from '../components/discover';

LogBox.ignoreAllLogs(true);


export default function Discover() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Discover',
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <DiscoverScreen />
    </>
  );
}
