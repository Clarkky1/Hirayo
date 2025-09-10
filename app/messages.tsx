import { LogBox } from 'react-native';
import { MessagesScreen } from '../components/messages';

LogBox.ignoreAllLogs(true);


export default function Messages() {
  return <MessagesScreen />;
}
