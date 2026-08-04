import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';
import { WATER_PAGE } from '@/constants/waterTheme';

type InsightBannerProps = {
  children: ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
  borderVariant?: 'lime' | 'water' | 'amber' | 'softRed';
};

const BORDER_LIGHT = {
  lime: '#ddfb43',
  water: WATER_PAGE.border,
  amber: '#f5d565',
  softRed: '#f5c4c4',
} as const;

const BORDER_DARK = {
  lime: '#5c6d05',
  water: '#1e4a6e',
  amber: '#92600a',
  softRed: '#7f1d1d',
} as const;

const BACKGROUND_LIGHT = {
  lime: '#fafbf4',
  water: WATER_PAGE.surface,
  amber: '#fffbeb',
  softRed: '#fef2f2',
} as const;

const BACKGROUND_DARK = {
  lime: '#1a2118',
  water: '#152028',
  amber: '#2a2410',
  softRed: '#2a1515',
} as const;

export function InsightBanner({
  children,
  icon = 'bulb-outline',
  borderVariant = 'lime',
}: InsightBannerProps) {
  const { isDark, colors } = useMizoraTheme();
  const isWater = borderVariant === 'water';
  const border = isDark ? BORDER_DARK[borderVariant] : BORDER_LIGHT[borderVariant];
  const background = isDark ? BACKGROUND_DARK[borderVariant] : BACKGROUND_LIGHT[borderVariant];

  return (
    <View
      className="flex-row items-center gap-3 rounded-full border px-4 py-3.5"
      style={{ borderColor: border, backgroundColor: background }}
    >
      <View
        className="h-10 w-10 items-center justify-center rounded-full"
        style={{
          backgroundColor: isWater
            ? isDark
              ? '#1e3a52'
              : WATER_PAGE.iconBg
            : isDark
              ? colors.surfaceSecondary
              : '#efefee',
        }}
      >
        <Ionicons
          name={icon}
          size={18}
          color={isWater ? WATER_PAGE.icon : isDark ? colors.textSecondary : '#626b5e'}
        />
      </View>
      <Text
        className="flex-1 text-sm leading-5"
        style={{ fontFamily: fonts.regular, color: colors.textStrong }}
      >
        {children}
      </Text>
    </View>
  );
}

export function InsightEmphasis({ children }: { children: ReactNode }) {
  const { colors } = useMizoraTheme();
  return <Text style={{ fontFamily: fonts.medium, color: colors.textStrong }}>{children}</Text>;
}
