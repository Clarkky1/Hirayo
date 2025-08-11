import { Stack } from 'expo-router';

export default function HelpSupportLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Help & Support',
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
