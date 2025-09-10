import { LogBox } from 'react-native';
import OnboardingScreen from '../screens/OnboardingScreen';

LogBox.ignoreAllLogs(true);


export default function Onboarding() {
  return <OnboardingScreen />;
}
