import { StatusBar } from 'expo-status-bar';

import { WaterDetailScreen } from '@/screens/WaterDetailScreen';

export default function WaterRoute() {
  return (
    <>
      <StatusBar style="dark" />
      <WaterDetailScreen />
    </>
  );
}
