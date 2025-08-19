import { Stack } from 'expo-router';

export default function TermsConditionsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Terms & Conditions',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
