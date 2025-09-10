import { Stack } from 'expo-router';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);


export default function ViewMessagesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffff',
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
