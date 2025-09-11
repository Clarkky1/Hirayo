import { Stack } from 'expo-router';
import { LogBox, Text, TouchableOpacity, View } from 'react-native';

LogBox.ignoreAllLogs(true);


export default function Test() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Test Page',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#667EEA',
          },
          headerTintColor: '#ffffff',
        }}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>This is a test page</Text>
        <TouchableOpacity onPress={() => console.log('Test button pressed')}>
          <Text>Test Button</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
