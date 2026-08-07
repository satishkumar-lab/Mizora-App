import { Modal, Pressable, Text, View, useWindowDimensions } from 'react-native';

import { mizoraCardElevationStyle } from '@/utils/platformStyles';
import type { HealthOverviewLayout, StepsHomeChartStyle } from '@/lib/home-dashboard-preferences';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';
import { mizoraType } from '@/theme/typography';

export type MenuAnchor = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type StepsCardMenuPopoverProps = {
  visible: boolean;
  anchor: MenuAnchor | null;
  layout: HealthOverviewLayout;
  chartStyle: StepsHomeChartStyle;
  onClose: () => void;
  onSelectLayout: (layout: HealthOverviewLayout) => void;
  onSelectChartStyle: (style: StepsHomeChartStyle) => void;
};

const MENU_WIDTH = 212;

function MenuItem({
  label,
  selected,
  onPress,
  last,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  last?: boolean;
}) {
  const { colors } = useMizoraTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`flex-row items-center justify-between px-3.5 py-2.5 ${last ? '' : 'border-b border-[#f2f3f0] dark:border-[#2a332a]'}`}
    >
      <Text style={{ ...mizoraType.headingH3, color: colors.textStrong }}>{label}</Text>
      {selected ? (
        <Text style={{ ...mizoraType.bodyMedium, fontFamily: fonts.bold, color: '#49a621' }}>
          ✓
        </Text>
      ) : null}
    </Pressable>
  );
}

export function StepsCardMenuPopover({
  visible,
  anchor,
  layout,
  chartStyle,
  onClose,
  onSelectLayout,
  onSelectChartStyle,
}: StepsCardMenuPopoverProps) {
  const { width: screenWidth } = useWindowDimensions();
  const { colors } = useMizoraTheme();

  if (!anchor) return null;

  const menuLeft = Math.min(
    Math.max(8, anchor.x + anchor.width - MENU_WIDTH),
    screenWidth - MENU_WIDTH - 8,
  );
  const menuTop = anchor.y + anchor.height + 6;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1">
        <Pressable className="absolute inset-0" onPress={onClose} accessibilityLabel="Close menu" />
        <View
          style={[
            mizoraCardElevationStyle(),
            {
              position: 'absolute',
              top: menuTop,
              left: menuLeft,
              width: MENU_WIDTH,
              borderRadius: 12,
              backgroundColor: colors.popoverBg,
              borderWidth: 0.67,
              borderColor: colors.border,
              overflow: 'hidden',
              zIndex: 2,
            },
          ]}
        >
          <Text
            className="px-3.5 pb-1 pt-2.5"
            style={{ ...mizoraType.captionMedium, color: colors.textMuted }}
          >
            Layout
          </Text>
          <MenuItem
            label="Default (full width)"
            selected={layout === 'stacked'}
            onPress={() => {
              onSelectLayout('stacked');
              onClose();
            }}
          />
          <MenuItem
            label="Steps on the left"
            selected={layout === 'split'}
            onPress={() => {
              onSelectLayout('split');
              onClose();
            }}
            last
          />
          <Text
            className="px-3.5 pb-1 pt-2.5"
            style={{ ...mizoraType.captionMedium, color: colors.textMuted }}
          >
            Hourly chart
          </Text>
          <MenuItem
            label="Bars"
            selected={chartStyle === 'bars'}
            onPress={() => {
              onSelectChartStyle('bars');
              onClose();
            }}
          />
          <MenuItem
            label="Gradient"
            selected={chartStyle === 'gradient'}
            onPress={() => {
              onSelectChartStyle('gradient');
              onClose();
            }}
            last
          />
        </View>
      </View>
    </Modal>
  );
}
