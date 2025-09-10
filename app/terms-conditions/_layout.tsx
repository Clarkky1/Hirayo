import { Stack } from 'expo-router';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);


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
