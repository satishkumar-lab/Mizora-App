import { LiveBadge } from '@/components/ui/LiveBadge';
import { useSteps } from '@/providers/StepsProvider';

type StepsLiveBadgeProps = {
  size?: 'xs' | 'sm' | 'md';
};

/** Live / Syncing / Off — tied to motion & health step tracking. */
export function StepsLiveBadge({ size = 'md' }: StepsLiveBadgeProps) {
  const { status } = useSteps();
  return <LiveBadge size={size} trackingStatus={status} />;
}
