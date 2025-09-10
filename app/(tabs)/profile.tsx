import { LogBox } from 'react-native';
import { ProfileScreen } from '../../components/profile';

LogBox.ignoreAllLogs(true);


export default function Profile() {
  return <ProfileScreen />;
}
