import { Stack } from 'expo-router';

export default function PayLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Payment',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
            color: '#FFFFFF',
          },
        }}
      />
    </Stack>
  );
}
