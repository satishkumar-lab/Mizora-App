import { Pressable, Text, View } from 'react-native';

import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { ForwardChevronIcon } from '@/components/icons/ForwardChevronIcon';
import { Card } from '@/components/ui/Card';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

type ProfileHeroCardProps = {
  displayName: string;
  memberLabel?: string;
  onPress: () => void;
  onPhotoUpdated?: () => void;
};

export function ProfileHeroCard({
  displayName,
  memberLabel,
  onPress,
  onPhotoUpdated,
}: ProfileHeroCardProps) {
  const { colors } = useMizoraTheme();

  return (
    <Card className="overflow-hidden p-0">
      <View className="flex-row items-center gap-3.5 px-4 py-4">
        <ProfileAvatar size={56} editable onPhotoUpdated={onPhotoUpdated} />

        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          className="min-w-0 flex-1 flex-row items-center"
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
        >
          <View className="min-w-0 flex-1" style={{ gap: 3 }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fonts.bold,
                fontSize: 16,
                color: colors.textStrong,
                letterSpacing: -0.2,
              }}
            >
              {displayName}
            </Text>
            {memberLabel ? (
              <Text style={{ fontFamily: fonts.regular, fontSize: 10, color: colors.textMuted }}>
                Using Mizora since {memberLabel}
              </Text>
            ) : null}
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: '#34c759' }}>
              Edit profile
            </Text>
          </View>
          <ForwardChevronIcon size={18} color={colors.textMuted} />
        </Pressable>
      </View>
    </Card>
  );
}
