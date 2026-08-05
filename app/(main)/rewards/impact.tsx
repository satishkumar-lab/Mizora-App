import { UnlockImpactScreen } from '@/screens/UnlockImpactScreen';
import { V2UnlockRouteGuard } from '@/components/v2/V2UnlockRouteGuard';

export default function UnlockImpactRoute() {
  return (
    <V2UnlockRouteGuard>
      <UnlockImpactScreen />
    </V2UnlockRouteGuard>
  );
}
