import { Redirect } from 'expo-router';

import { WEEKLY_HEALTH_REPORT_ENABLED } from '@/constants/productScope';
import { WeeklyHealthReportScreen } from '@/screens/WeeklyHealthReportScreen';

export default function WeeklyReportRoute() {
  if (!WEEKLY_HEALTH_REPORT_ENABLED) {
    return <Redirect href="/notifications" />;
  }
  return <WeeklyHealthReportScreen />;
}
