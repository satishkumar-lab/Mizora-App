import { Platform } from 'react-native';

import type { StepsTrackingStatus } from '@/lib/health/readTodaySteps';

export function isStepsTrackingReady(status: StepsTrackingStatus): boolean {
  return status === 'ready';
}

export function isStepsTrackingLoading(status: StepsTrackingStatus): boolean {
  return status === 'loading' || status === 'pending';
}

export function isStepsTrackingBlocked(status: StepsTrackingStatus): boolean {
  return (
    status === 'pending' ||
    status === 'denied' ||
    status === 'unavailable' ||
    status === 'error' ||
    status === 'provider_install' ||
    status === 'provider_update'
  );
}

/** Home: permission card only after the user explicitly denied step tracking. */
export function shouldShowHomeStepsPermissionCard(status: StepsTrackingStatus): boolean {
  return status === 'denied';
}

export function isAndroidStepProviderSetupStatus(status: StepsTrackingStatus): boolean {
  return (
    Platform.OS === 'android' && (status === 'provider_install' || status === 'provider_update')
  );
}

export type StepsPermissionUiCopy = {
  title: string;
  body: string;
  primaryLabel: string;
  secondaryLabel?: string;
};

function iosPendingCopy(): StepsPermissionUiCopy {
  return {
    title: 'Turn on step tracking',
    body: 'Mizora uses Motion & Fitness to show live steps, streaks, and gentle insights. You’re always in control—we never sell your health data.',
    primaryLabel: 'Enable Motion access',
  };
}

function androidPendingCopy(): StepsPermissionUiCopy {
  return {
    title: 'Allow step tracking',
    body: 'Mizora reads today’s step count to power your dashboard, streaks, and goals. You choose what to share and can turn this off anytime.',
    primaryLabel: 'Allow step tracking',
  };
}

function iosDeniedCopy(): StepsPermissionUiCopy {
  return {
    title: 'Motion access is off',
    body: 'Live steps and streaks are paused while permission is off. Your water log and goals on this device are safe—turn access back on whenever you’re ready.',
    primaryLabel: 'Try again',
    secondaryLabel: 'Open Settings',
  };
}

function androidDeniedCopy(): StepsPermissionUiCopy {
  return {
    title: 'Step tracking is off',
    body: 'Live steps and streaks are paused. Your water log and goals on this device are unchanged—you can enable tracking again in a few taps.',
    primaryLabel: 'Enable step tracking',
    secondaryLabel: 'Open Settings',
  };
}

function iosUnavailableCopy(): StepsPermissionUiCopy {
  return {
    title: 'Steps aren’t available here',
    body: 'This iPhone can’t share step counts with Mizora. You can still track water, set goals, and enjoy the rest of your dashboard.',
    primaryLabel: 'Open Settings',
  };
}

function androidUnavailableCopy(): StepsPermissionUiCopy {
  return {
    title: 'Step tracking isn’t supported',
    body: 'This device can’t sync steps with Mizora yet. Water tracking and your goals still work on this phone.',
    primaryLabel: 'Open Settings',
  };
}

function androidProviderInstallCopy(): StepsPermissionUiCopy {
  return {
    title: 'Finish step tracking setup',
    body: 'One quick Play Store step completes setup on this phone. When you return, Mizora continues automatically—no extra taps on Home.',
    primaryLabel: 'Continue',
    secondaryLabel: 'Not now',
  };
}

function androidProviderUpdateCopy(): StepsPermissionUiCopy {
  return {
    title: 'Finish step tracking setup',
    body: 'A short update in the Play Store is needed to keep reading steps on this device. Come back here when it’s done.',
    primaryLabel: 'Update & continue',
    secondaryLabel: 'Not now',
  };
}

export function stepsPermissionUiCopy(status: StepsTrackingStatus): StepsPermissionUiCopy {
  if (status === 'loading') {
    return {
      title: 'Syncing your steps',
      body: 'One moment—we’re refreshing today’s step count.',
      primaryLabel: 'Please wait',
    };
  }

  if (status === 'pending') {
    return Platform.OS === 'android' ? androidPendingCopy() : iosPendingCopy();
  }

  if (status === 'denied') {
    return Platform.OS === 'android' ? androidDeniedCopy() : iosDeniedCopy();
  }

  if (status === 'provider_install') {
    return androidProviderInstallCopy();
  }

  if (status === 'provider_update') {
    return androidProviderUpdateCopy();
  }

  if (status === 'unavailable') {
    return Platform.OS === 'android' ? androidUnavailableCopy() : iosUnavailableCopy();
  }

  return {
    title: 'Couldn’t refresh steps',
    body: 'Nothing was lost on this device. Try again and we’ll pick up where you left off.',
    primaryLabel: 'Try again',
    secondaryLabel: 'Open Settings',
  };
}

export type LiveBadgePresentation = {
  label: string;
  showPulse: boolean;
  tone: 'live' | 'sync' | 'off';
};

export function liveBadgePresentation(status: StepsTrackingStatus): LiveBadgePresentation {
  if (status === 'ready') {
    return { label: 'Live', showPulse: true, tone: 'live' };
  }
  if (status === 'loading' || status === 'pending') {
    return { label: 'Syncing', showPulse: false, tone: 'sync' };
  }
  if (status === 'denied') {
    return { label: 'Off', showPulse: false, tone: 'off' };
  }
  if (status === 'provider_install' || status === 'provider_update') {
    return { label: 'Setup', showPulse: false, tone: 'off' };
  }
  if (status === 'unavailable') {
    return { label: 'Unsupported', showPulse: false, tone: 'off' };
  }
  return { label: 'Paused', showPulse: false, tone: 'off' };
}
