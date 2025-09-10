import { LogBox } from 'react-native';
import { LoginScreen } from '../components/login';

LogBox.ignoreAllLogs(true);


export default function Login() {
  return <LoginScreen />;
}
