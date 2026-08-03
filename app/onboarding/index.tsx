import { StatusBar } from 'expo-status-bar';

import { OnboardingScreen } from '@/screens/OnboardingScreen';

export default function OnboardingRoute() {
  return (
    <>
      <StatusBar style="dark" />
      <OnboardingScreen />
    </>
  );
}
