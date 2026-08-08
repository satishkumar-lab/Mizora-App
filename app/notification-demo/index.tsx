import { Redirect } from 'expo-router';

import { NotificationDemoScreen } from '@/demo/notifications/NotificationDemoScreen';

/** Dev-only route — production redirects to home. */
export default function NotificationDemoRoute() {
  if (!__DEV__) {
    return <Redirect href="/home" />;
  }
  return <NotificationDemoScreen />;
}
