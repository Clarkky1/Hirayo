import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
import { ReviewOrderScreen } from '../components/review-order';

LogBox.ignoreAllLogs(true);


export default function ReviewOrder() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Review Order',
          headerStyle: {
            backgroundColor: '#667EEA',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <ReviewOrderScreen />
    </>
  );
}
