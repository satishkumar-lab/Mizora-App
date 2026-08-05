import { BlockedAppsManageScreen } from '@/screens/BlockedAppsManageScreen';
import { V2UnlockRouteGuard } from '@/components/v2/V2UnlockRouteGuard';

export default function RewardsListRoute() {
  return (
    <V2UnlockRouteGuard>
      <BlockedAppsManageScreen />
    </V2UnlockRouteGuard>
  );
}
