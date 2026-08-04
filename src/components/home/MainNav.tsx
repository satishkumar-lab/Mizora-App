import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname, useRouter, type Href } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { metricIoniconName } from '@/components/icons/MetricBadgeIcon';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';

export type MainNavTabId = 'home' | 'steps' | 'streak' | 'notifications';

/** Primary product surface — opened from the + FAB */
export const UNLOCK_IMPACT_HREF = '/rewards/impact' as const;

type MainNavProps = {
  activeTab?: MainNavTabId;
  onFabPress?: () => void;
};

type TabConfig = {
  id: MainNavTabId;
  iconActive: keyof typeof Ionicons.glyphMap;
  iconInactive: keyof typeof Ionicons.glyphMap;
  size?: number;
  href?: Href;
  accessibilityLabel: string;
  disabled?: boolean;
};

const TAB_SLOT_WIDTH = 65;
const TAB_BAR_INSET = 8;
/** Icon on lime active pill — always dark for contrast (light + dark theme). */
const ACTIVE_TAB_ICON_COLOR = '#141c12';
const FAB_GRADIENT = ['#d6ff92', '#97ec0d'] as const;

function activeTabPillBg(isDark: boolean): string {
  return isDark ? '#c8f526' : '#e4ffb8';
}

const TABS: TabConfig[] = [
  {
    id: 'home',
    iconActive: 'home',
    iconInactive: 'home-outline',
    href: '/home',
    accessibilityLabel: 'Home',
  },
  {
    id: 'steps',
    iconActive: metricIoniconName('steps'),
    iconInactive: metricIoniconName('steps'),
    href: '/steps',
    accessibilityLabel: 'Daily progress',
  },
  {
    id: 'streak',
    iconActive: 'heart',
    iconInactive: 'heart-outline',
    href: '/streak',
    accessibilityLabel: 'Streak calendar',
  },
  {
    id: 'notifications',
    iconActive: 'notifications',
    iconInactive: 'notifications-outline',
    size: 22,
    href: '/notifications',
    accessibilityLabel: 'Notifications',
  },
];

/** + FAB primary stack — no tab pill while user is here. */
function isFabPrimaryRoute(pathname: string): boolean {
  return pathname.startsWith('/rewards');
}

function tabFromPathname(pathname: string): MainNavTabId | null {
  if (pathname.startsWith('/notifications')) return 'notifications';
  if (pathname.startsWith('/steps')) return 'steps';
  if (pathname.startsWith('/streak')) return 'streak';
  if (pathname.startsWith('/home')) return 'home';
  return null;
}

function tabIndex(id: MainNavTabId): number {
  return TABS.findIndex((t) => t.id === id);
}

/**
 * Bottom nav — solid “floating pill” (no blur). Real glassmorphism is inconsistent on Android;
 * iOS blur can be added later behind this surface if needed.
 */
export function MainNav({ activeTab, onFabPress }: MainNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const fabRouteActive = isFabPrimaryRoute(pathname);
  const pathnameTab = tabFromPathname(pathname);
  const resolvedActive: MainNavTabId | null =
    activeTab !== undefined ? activeTab : fabRouteActive ? null : pathnameTab;
  const { colors, isDark } = useMizoraTheme();

  const inactiveIconColor = isDark ? colors.textSecondary : colors.textMuted;

  const activeIndex = resolvedActive === null ? -1 : tabIndex(resolvedActive);
  const pillX = useSharedValue(Math.max(0, activeIndex) * TAB_SLOT_WIDTH);
  const pillOpacity = useSharedValue(activeIndex >= 0 ? 1 : 0);

  useEffect(() => {
    if (activeIndex < 0) {
      pillOpacity.value = withSpring(0, { damping: 22, stiffness: 280 });
      return;
    }
    pillOpacity.value = withSpring(1, { damping: 22, stiffness: 280 });
    pillX.value = withSpring(activeIndex * TAB_SLOT_WIDTH, {
      damping: 20,
      stiffness: 260,
      mass: 0.85,
    });
  }, [activeIndex, pillOpacity, pillX]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
    opacity: pillOpacity.value,
  }));

  return (
    <View className="flex-row items-center gap-[15px]">
      <View
        className="relative flex-row rounded-full p-2"
        style={{
          backgroundColor: colors.navPillBg,
          borderWidth: 1,
          borderColor: colors.navPillBorder,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: isDark ? 0.2 : 0.04,
          shadowRadius: 10,
          elevation: 8,
        }}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              left: TAB_BAR_INSET,
              top: TAB_BAR_INSET,
              width: TAB_SLOT_WIDTH,
              height: 45,
              borderRadius: 22.5,
              backgroundColor: activeTabPillBg(isDark),
            },
            pillStyle,
          ]}
        />

        {TABS.map((tab) => {
          const isActive = resolvedActive !== null && tab.id === resolvedActive;
          const iconName = isActive ? tab.iconActive : tab.iconInactive;
          const iconSize = tab.size ?? 24;
          const isDisabled = tab.disabled === true;

          return (
            <Pressable
              key={tab.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive, disabled: isDisabled }}
              accessibilityLabel={tab.accessibilityLabel}
              disabled={isDisabled}
              onPress={() => {
                if (isDisabled || !tab.href) return;
                router.navigate(tab.href);
              }}
              className="h-[45px] w-[65px] items-center justify-center rounded-full"
              style={{
                opacity: isDisabled ? 0.45 : 1,
              }}
            >
              <Ionicons
                name={iconName}
                size={iconSize}
                color={isActive ? ACTIVE_TAB_ICON_COLOR : inactiveIconColor}
              />
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Unlock impact"
        accessibilityState={{ selected: fabRouteActive }}
        onPress={() => {
          if (onFabPress) {
            onFabPress();
            return;
          }
          router.navigate(UNLOCK_IMPACT_HREF);
        }}
        style={({ pressed }) =>
          pressed ? { opacity: 0.92, transform: [{ scale: 0.97 }] } : undefined
        }
      >
        <LinearGradient
          colors={[...FAB_GRADIENT]}
          style={{
            width: 61,
            height: 61,
            borderRadius: 30.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name="add"
            size={29}
            color={fabRouteActive ? ACTIVE_TAB_ICON_COLOR : '#ffffff'}
          />
        </LinearGradient>
      </Pressable>
    </View>
  );
}
