import { LogBox } from 'react-native';
import { SavedItemsScreen } from '../../components/saved';

LogBox.ignoreAllLogs(true);


export default function Saved() {
  return <SavedItemsScreen />;
}
