import { StatusBar } from 'expo-status-bar';

import { StepsDetailScreen } from '@/screens/StepsDetailScreen';

export default function StepsDetailRoute() {
  return (
    <>
      <StatusBar style="dark" />
      <StepsDetailScreen />
    </>
  );
}
