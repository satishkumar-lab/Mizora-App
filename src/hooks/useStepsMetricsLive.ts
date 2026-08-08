import { isStepsTrackingReady } from '@/lib/health/stepsTrackingUi';
import { useSteps } from '@/providers/StepsProvider';

/** True when live step counts/charts are safe to show in UI. */
export function useStepsMetricsLive() {
  const { status, retryTracking, runStepsSetupAction } = useSteps();
  return {
    metricsLive: isStepsTrackingReady(status),
    status,
    retryTracking,
    runStepsSetupAction,
  };
}
