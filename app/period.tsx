import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
import { RentalPeriodScreen } from '../components/period';

LogBox.ignoreAllLogs(true);


export default function Period() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Rental Period',
          headerStyle: {
            backgroundColor: '#0066CC',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <RentalPeriodScreen />
    </>
  );
}
