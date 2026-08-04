import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { MizoraPlusCrown } from '@/components/icons/MizoraPlusCrown';
import { ThemeToggleButton } from '@/components/ui/ThemeToggleButton';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

export function HomeHeader() {
  const { colors, isDark } = useMizoraTheme();
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open profile and settings"
        onPress={() => router.push('/profile')}
        hitSlop={8}
      >
        <View>
          <ProfileAvatar size={44} />
          <View className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-mizora-bg bg-mizora-primary dark:border-mizora-bg-dark" />
        </View>
      </Pressable>

      <View className="flex-row items-center gap-2.5">
        <View
          className="flex-row items-center gap-1.5 rounded-[10px] bg-mizora-accent-soft px-3 py-2"
          style={
            isDark
              ? {
                  backgroundColor: colors.iconBadgeBg,
                  borderWidth: 1,
                  borderColor: colors.iconBadgeBorder,
                }
              : undefined
          }
        >
          <MizoraPlusCrown size={14} color={isDark ? colors.textAccentGreen : undefined} />
          <Text
            className="text-xs"
            style={{ fontFamily: fonts.medium, color: isDark ? colors.textAccentGreen : '#5c6d05' }}
          >
            Mizora+
          </Text>
        </View>
        <ThemeToggleButton />
      </View>
    </View>
  );
}
