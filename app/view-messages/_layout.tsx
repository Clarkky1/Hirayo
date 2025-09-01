import { Stack } from 'expo-router';

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
