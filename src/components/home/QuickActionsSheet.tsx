import { useRouter, type Href } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useMemo } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ForwardChevronIcon } from '@/components/icons/ForwardChevronIcon';
import { MetricBadgeIcon, type MetricBadgeKind } from '@/components/icons/MetricBadgeIcon';
import { SettingsGroupDivider } from '@/components/settings/SettingsGroupDivider';
import { useDailyStepGoal } from '@/hooks/useDailyStepGoal';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { activeCaloriesFromSteps } from '@/lib/calories-estimate';
import { computeCurrentStreakThroughToday } from '@/lib/streakCalendar';
import { useSteps } from '@/providers/StepsProvider';
import { useWaterIntake } from '@/providers/WaterIntakeProvider';
import { fonts } from '@/theme/tokens';
import { mizoraBottomSheetStyle, mizoraProminentCardStyle } from '@/utils/platformStyles';

function QuickActionsBackdrop({ isDark, onClose }: { isDark: boolean; onClose: () => void }) {
  const tint = isDark ? 'dark' : 'light';
  const veil = isDark ? 'rgba(26, 33, 24, 0.48)' : 'rgba(244, 246, 243, 0.55)';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close quick actions"
      onPress={onClose}
      style={StyleSheet.absoluteFill}
    >
      {Platform.OS === 'ios' ? (
        <BlurView intensity={isDark ? 20 : 28} tint={tint} style={StyleSheet.absoluteFill} />
      ) : null}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: veil }]} />
    </Pressable>
  );
}

type QuickActionItem = {
  id: string;
  label: string;
  subtitle: string;
  href: Href;
  kind: MetricBadgeKind;
};

type QuickActionsSheetProps = {
  visible: boolean;
  onClose: () => void;
};

function QuickActionRow({
  item,
  onPress,
  isLast,
}: {
  item: QuickActionItem;
  onPress: () => void;
  isLast?: boolean;
}) {
  const { colors, isDark } = useMizoraTheme();

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={item.label}
        onPress={onPress}
        style={({ pressed }) => ({
          backgroundColor: pressed
            ? isDark
              ? 'rgba(255,255,255,0.06)'
              : 'rgba(244, 246, 243, 0.85)'
            : 'transparent',
        })}
      >
        <View className="flex-row items-center gap-3 px-4 py-4">
          <MetricBadgeIcon kind={item.kind} size={42} />
          <View className="min-w-0 flex-1" style={{ gap: 3 }}>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 14,
                color: colors.textStrong,
                letterSpacing: -0.15,
              }}
            >
              {item.label}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fonts.regular,
                fontSize: 12,
                lineHeight: 16,
                color: colors.textSecondary,
              }}
            >
              {item.subtitle}
            </Text>
          </View>
          <View
            className="h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: isDark ? colors.surfaceMuted : '#f4f6f3' }}
          >
            <ForwardChevronIcon size={14} color={colors.textMuted} />
          </View>
        </View>
      </Pressable>
      {isLast ? null : <SettingsGroupDivider />}
    </>
  );
}

function formatMl(ml: number): string {
  if (ml >= 1000) return `${(ml / 1000).toFixed(1).replace(/\.0$/, '')} L`;
  return `${ml.toLocaleString()} ml`;
}

/** V1 FAB — half-height sheet with health shortcuts (slide from bottom). */
export function QuickActionsSheet({ visible, onClose }: QuickActionsSheetProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { colors, isDark } = useMizoraTheme();

  const sheetBorder = isDark ? colors.borderDivider : '#ebefea';
  const listBorder = isDark ? colors.borderDivider : '#e8ece6';
  const sheetTint = isDark ? colors.bg : '#f4f6f3';

  const { goal: stepGoal } = useDailyStepGoal();
  const { loggedMl, goalMl } = useWaterIntake();
  const { todaySteps } = useSteps();
  const streakDays = computeCurrentStreakThroughToday();
  const activeKcal = activeCaloriesFromSteps(todaySteps);

  const actions = useMemo((): QuickActionItem[] => {
    const streakSubtitle =
      streakDays === 0
        ? 'Start today — open your calendar'
        : streakDays === 1
          ? '1 day — keep the chain going'
          : `${streakDays} days — view calendar & wins`;

    return [
      {
        id: 'step-goal',
        label: 'Daily step target',
        subtitle: `${stepGoal.toLocaleString()} steps · tap to change`,
        href: '/steps/goal',
        kind: 'goal',
      },
      {
        id: 'water',
        label: 'Water intake',
        subtitle: `${formatMl(loggedMl)} of ${formatMl(goalMl)} today`,
        href: '/water',
        kind: 'water',
      },
      {
        id: 'calories',
        label: 'Calories burned',
        subtitle: `${activeKcal.toLocaleString()} kcal active · from your steps`,
        href: '/calories',
        kind: 'calories',
      },
      {
        id: 'streak',
        label: 'Streak',
        subtitle: streakSubtitle,
        href: '/streak',
        kind: 'steps',
      },
      {
        id: 'steps-detail',
        label: "Today's progress",
        subtitle: `${todaySteps.toLocaleString()} steps · charts & weekly view`,
        href: '/steps',
        kind: 'activeTime',
      },
      {
        id: 'achievements',
        label: 'Achievements',
        subtitle: 'Badges and monthly challenges',
        href: '/streak/achievements',
        kind: 'distance',
      },
    ];
  }, [activeKcal, goalMl, loggedMl, stepGoal, streakDays, todaySteps]);

  const sheetMaxHeight = Math.min(height * 0.54, 500);

  const navigate = (href: Href) => {
    onClose();
    requestAnimationFrame(() => {
      router.push(href);
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <QuickActionsBackdrop isDark={isDark} onClose={onClose} />

        <View
          style={[
            mizoraBottomSheetStyle(sheetTint, sheetBorder),
            {
              maxHeight: sheetMaxHeight,
              paddingBottom: Math.max(insets.bottom, 12) + 6,
            },
          ]}
        >
          <View className="items-center pb-1 pt-2.5">
            <View
              className="h-1 rounded-full"
              style={{ width: 40, backgroundColor: isDark ? colors.borderDivider : '#d8ddd4' }}
            />
          </View>

          <View className="px-5 pb-4 pt-2">
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 10,
                letterSpacing: 1.1,
                textTransform: 'uppercase',
                color: isDark ? '#c8f526' : '#5c6d05',
                marginBottom: 4,
              }}
            >
              Shortcuts
            </Text>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 20,
                color: colors.textStrong,
                letterSpacing: -0.4,
              }}
            >
              Quick actions
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 12,
                lineHeight: 17,
                color: colors.textMuted,
                marginTop: 4,
              }}
            >
              Goals, logging, and progress — all in one place.
            </Text>
          </View>

          <View className="px-5 pb-1">
            <View style={mizoraProminentCardStyle(listBorder, colors.card)}>
              {actions.map((item, index) => (
                <QuickActionRow
                  key={item.id}
                  item={item}
                  isLast={index === actions.length - 1}
                  onPress={() => navigate(item.href)}
                />
              ))}
            </View>
          </View>

          <Text
            className="px-5 pt-3 text-center"
            style={{
              fontFamily: fonts.regular,
              fontSize: 11,
              color: colors.textMuted,
            }}
          >
            Tap outside or + to close
          </Text>
        </View>
      </View>
    </Modal>
  );
}
