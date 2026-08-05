import { Redirect, type Href } from 'expo-router';
import type { ReactNode } from 'react';

import { UNLOCK_REWARDS_V2_ENABLED } from '@/constants/productScope';

type V2UnlockRouteGuardProps = {
  children: ReactNode;
  /** Where to send users if they deep-link while V2 is off */
  fallbackHref?: Href;
};

/** Keeps unlock / lock-challenge routes in the repo but off-limits in V1. */
export function V2UnlockRouteGuard({ children, fallbackHref = '/home' }: V2UnlockRouteGuardProps) {
  if (!UNLOCK_REWARDS_V2_ENABLED) {
    return <Redirect href={fallbackHref} />;
  }
  return children;
}
