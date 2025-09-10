import { Stack } from 'expo-router';

export default function VideoCallLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          title: 'Video Call'
        }} 
      />
    </Stack>
  );
}
