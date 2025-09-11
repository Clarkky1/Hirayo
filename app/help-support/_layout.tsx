import { Stack } from 'expo-router';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);


export default function HelpSupportLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Help & Support',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#667EEA',
          },
          headerTintColor: '#ffffff',
        }}
      />
    </Stack>
  );
}
