import { StatusBar } from 'expo-status-bar';

import { V2UnlockRouteGuard } from '@/components/v2/V2UnlockRouteGuard';
import { RewardAppDetailScreen } from '@/screens/RewardAppDetailScreen';

export default function RewardAppRoute() {
  return (
    <V2UnlockRouteGuard>
      <StatusBar style="dark" />
      <RewardAppDetailScreen />
    </V2UnlockRouteGuard>
  );
}
