import { Stack } from 'expo-router';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);


export default function MyItemsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'My Items',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <Stack.Screen
        name="view"
        options={{
          title: 'View Item',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: 'Edit Item',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
