import { Stack } from 'expo-router';

export default function MyItemsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'My Items',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="view"
        options={{
          title: 'View Item',
          headerShown: true,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: 'Edit Item',
          headerShown: true,
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
