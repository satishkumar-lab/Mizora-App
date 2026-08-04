import { StatusBar } from 'expo-status-bar';

import { CaloriesDetailScreen } from '@/screens/CaloriesDetailScreen';

export default function CaloriesRoute() {
  return (
    <>
      <StatusBar style="dark" />
      <CaloriesDetailScreen />
    </>
  );
}
