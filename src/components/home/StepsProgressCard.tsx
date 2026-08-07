import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { StepsCardMenuPopover, type MenuAnchor } from '@/components/home/StepsCardMenuPopover';
import { StepsArcRing } from '@/components/steps/StepsArcRing';
import { StepsHourlyChart } from '@/components/steps/StepsHourlyChart';
import { Card } from '@/components/ui/Card';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { StepsCardMenuIcon } from '@/components/icons/StepsCardMenuIcon';
import { useSteps } from '@/providers/StepsProvider';
import { useDailyStepGoal } from '@/hooks/useDailyStepGoal';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { useHomeDashboardPreferences } from '@/providers/HomeDashboardPreferencesProvider';
import { mizoraType } from '@/theme/typography';

type StepsProgressCardProps = {
  compact?: boolean;
};

export function StepsProgressCard({ compact = false }: StepsProgressCardProps) {
  const router = useRouter();
  const { snapshot, refresh: refreshSteps, hourlySlots } = useSteps();
  const { steps } = snapshot;
  const { goal, refresh } = useDailyStepGoal();
  const { prefs, setStepsChartStyle, setHealthOverviewLayout } = useHomeDashboardPreferences();
  const { colors } = useMizoraTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor | null>(null);
  const menuTriggerRef = useRef<View>(null);

  useFocusEffect(
    useCallback(() => {
      void refresh();
      void refreshSteps();
    }, [refresh, refreshSteps]),
  );

  const openDetail = useCallback(() => {
    router.push('/steps');
  }, [router]);

  const openMenu = useCallback(() => {
    menuTriggerRef.current?.measureInWindow((x, y, width, height) => {
      setMenuAnchor({ x, y, width, height });
      setMenuOpen(true);
    });
  }, []);

  const axisMode = compact ? 'narrow' : 'full';

  return (
    <>
      <Card className={`w-full gap-4 px-4 py-4 ${compact ? 'gap-3 px-3 py-3' : ''}`}>
        <View className="flex-row items-center justify-between">
          <Pressable
            accessibilityRole="button"
            accessibilityHint="Opens today’s steps detail"
            onPress={openDetail}
            className="flex-1 flex-row items-center gap-1.5"
          >
            <MetricBadgeIcon kind="steps" size={compact ? 18 : 20} />
            <Text
              style={{
                ...(compact ? mizoraType.cardTitleCompact : mizoraType.cardTitle),
                color: colors.textStrong,
              }}
            >
              Today&apos;s Steps
            </Text>
          </Pressable>
          <View ref={menuTriggerRef} collapsable={false}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Steps card options"
              hitSlop={12}
              onPress={openMenu}
              className="p-1"
            >
              <StepsCardMenuIcon size={16} color={colors.textStrong} />
            </Pressable>
          </View>
        </View>

        <Pressable accessibilityRole="button" onPress={openDetail}>
          <StepsArcRing steps={steps} goal={goal} size={compact ? 'card' : 'cardSpacious'} />
        </Pressable>

        <StepsHourlyChart
          slots={hourlySlots}
          axisMode={axisMode}
          chartStyle={prefs.stepsChartStyle}
        />
      </Card>

      <StepsCardMenuPopover
        visible={menuOpen}
        anchor={menuAnchor}
        chartStyle={prefs.stepsChartStyle}
        layout={prefs.healthOverviewLayout}
        onClose={() => setMenuOpen(false)}
        onSelectChartStyle={setStepsChartStyle}
        onSelectLayout={setHealthOverviewLayout}
      />
    </>
  );
}
