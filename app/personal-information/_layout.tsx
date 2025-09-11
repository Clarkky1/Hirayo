import { Stack } from 'expo-router';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);


export default function PersonalInformationLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Personal Information',
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
