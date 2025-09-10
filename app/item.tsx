import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
import { ItemDetailScreen } from '../components/item';

LogBox.ignoreAllLogs(true);


export default function Item() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Item Details',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <ItemDetailScreen />
    </>
  );
}
