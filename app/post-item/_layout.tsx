import { Stack } from 'expo-router';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);


export default function PostItemLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Post New Item',
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
