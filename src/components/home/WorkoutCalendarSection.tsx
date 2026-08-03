import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { CalendarDayPill, type CalendarDayPillModel } from '@/components/ui/CalendarDayPill';
import { Card } from '@/components/ui/Card';
import { fonts } from '@/theme/tokens';

const DAYS: CalendarDayPillModel[] = [
  { weekday: 'Mon', day: '04', variant: 'active' },
  { weekday: 'Tue', day: '05', variant: 'active', streak: true },
  { weekday: 'Wed', day: '06', variant: 'active' },
  { weekday: 'Thu', day: '07', variant: 'today' },
  { weekday: 'Fri', day: '07', variant: 'future' },
  { weekday: 'Sat', day: '09', variant: 'future' },
];

export function WorkoutCalendarSection() {
  return (
    <Card className="gap-4 rounded-[24px] p-4">
      <Text className="text-base text-black" style={{ fontFamily: fonts.medium }}>
        Workout Calendar
      </Text>
      <View className="flex-row justify-between">
        {DAYS.map((d) => (
          <CalendarDayPill key={`${d.weekday}-${d.day}`} day={d} />
        ))}
      </View>
      <Text className="text-[13px] text-[#6b7280]" style={{ fontFamily: fonts.regular }}>
        Routine leads to result.{' '}
        <Text style={{ fontFamily: fonts.bold, color: '#111827' }}>Stay Consistent!</Text>
      </Text>
    </Card>
  );
}

export function InsightBanner() {
  return (
    <View className="bg-mizora-muted flex-row items-center gap-3 rounded-[32px] border border-mizora-accent px-4 py-3.5">
      <View className="h-10 w-10 items-center justify-center rounded-[20px] bg-[#efefee]">
        <Ionicons name="bulb-outline" size={18} color="#626b5e" />
      </View>
      <Text className="flex-1 text-sm leading-5 text-black" style={{ fontFamily: fonts.regular }}>
        You burn more calories on days you work out{' '}
        <Text style={{ fontFamily: fonts.bold }}>before 9AM.</Text> 🔥
      </Text>
    </View>
  );
}
