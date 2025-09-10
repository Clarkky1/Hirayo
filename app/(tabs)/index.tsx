import { LogBox } from 'react-native';
import { HomeScreen } from '../../components/home';

LogBox.ignoreAllLogs(true);


export default function Home() {
  return <HomeScreen />;
}
