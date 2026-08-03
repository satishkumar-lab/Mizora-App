import { StatusBar } from 'expo-status-bar';

import { StepsGoalScreen } from '@/screens/StepsGoalScreen';

export default function StepsGoalRoute() {
  return (
    <>
      <StatusBar style="dark" />
      <StepsGoalScreen />
    </>
  );
}
