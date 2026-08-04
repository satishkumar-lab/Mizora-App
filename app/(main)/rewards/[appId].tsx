import { StatusBar } from 'expo-status-bar';

import { RewardAppDetailScreen } from '@/screens/RewardAppDetailScreen';

export default function RewardAppRoute() {
  return (
    <>
      <StatusBar style="dark" />
      <RewardAppDetailScreen />
    </>
  );
}
