import { Stack } from 'expo-router';
import { LogBox } from 'react-native';
import PostItemScreen from './PostItemScreen';

LogBox.ignoreAllLogs(true);


export default function PostItemLayout() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Post Item',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#667EEA',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <PostItemScreen />
    </>
  );
}
