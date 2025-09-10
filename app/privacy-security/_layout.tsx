import { Stack } from 'expo-router';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);


export default function PrivacySecurityLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Privacy & Security',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
    </Stack>
  );
}
