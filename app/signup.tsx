import { LogBox } from 'react-native';
import { SignupScreen } from '../components/signup';

LogBox.ignoreAllLogs(true);


export default function Signup() {
  return <SignupScreen />;
}
