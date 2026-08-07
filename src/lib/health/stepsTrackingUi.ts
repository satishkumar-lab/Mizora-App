import { Platform } from 'react-native';

import type { StepsTrackingStatus } from '@/lib/health/readTodaySteps';

export function isStepsTrackingReady(status: StepsTrackingStatus): boolean {
  return status === 'ready';
}

export function isStepsTrackingLoading(status: StepsTrackingStatus): boolean {
  return status === 'loading';
}

export function isStepsTrackingBlocked(status: StepsTrackingStatus): boolean {
  return (
    status === 'pending' || status === 'denied' || status === 'unavailable' || status === 'error'
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
    title: 'Connect your steps',
    body: 'Link Health Connect so Mizora can reflect today’s steps on your dashboard. You choose what to share, and you can disconnect anytime.',
    primaryLabel: 'Connect Health Connect',
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
    title: 'Health Connect access is off',
    body: 'We can’t read steps until Health Connect allows Mizora. Your other progress on this device is unchanged—restore access in a few taps.',
    primaryLabel: 'Try again',
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
    title: 'Health Connect isn’t available',
    body: 'Install or update Health Connect to sync steps with Mizora. Until then, water tracking and your goals still work beautifully.',
    primaryLabel: 'Open Settings',
  };
}

export function stepsPermissionUiCopy(status: StepsTrackingStatus): StepsPermissionUiCopy {
  if (status === 'loading') {
    return {
      title: 'Syncing your steps',
      body: 'One moment—we’re connecting to your step counter and refreshing today’s totals.',
      primaryLabel: 'Please wait',
    };
  }

  if (status === 'pending') {
    return Platform.OS === 'android' ? androidPendingCopy() : iosPendingCopy();
  }

  if (status === 'denied') {
    return Platform.OS === 'android' ? androidDeniedCopy() : iosDeniedCopy();
  }

  if (status === 'unavailable') {
    return Platform.OS === 'android' ? androidUnavailableCopy() : iosUnavailableCopy();
  }

  return {
    title: 'Couldn’t refresh steps',
    body: 'A small connection hiccup—nothing was lost. Give it another try; we’ll pick up right where you left off.',
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
  if (status === 'loading') {
    return { label: 'Syncing', showPulse: false, tone: 'sync' };
  }
  if (status === 'pending') {
    return { label: 'Setup', showPulse: false, tone: 'off' };
  }
  if (status === 'denied') {
    return { label: 'Off', showPulse: false, tone: 'off' };
  }
  if (status === 'unavailable') {
    return { label: 'Unsupported', showPulse: false, tone: 'off' };
  }
  return { label: 'Paused', showPulse: false, tone: 'off' };
}
