import { LogBox } from 'react-native';
import { TransactionsScreen } from '../../components/transactions';

LogBox.ignoreAllLogs(true);

export default function Transactions() {
  return <TransactionsScreen />;
}
