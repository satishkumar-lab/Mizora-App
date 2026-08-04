import { Text, TextInput, View } from 'react-native';

import { ActivityLevelChips } from '@/components/settings/ActivityLevelChips';
import { CardInsetDivider } from '@/components/ui/CardInsetDivider';
import { Card } from '@/components/ui/Card';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import type { WaterActivityLevel } from '@/lib/water-recommendation';
import { formatLitersFromMl } from '@/lib/water-recommendation';
import { fonts } from '@/theme/tokens';

type ProfileHealthEditorCardProps = {
  weightText: string;
  onChangeWeight: (value: string) => void;
  activityLevel: WaterActivityLevel;
  onChangeActivity: (level: WaterActivityLevel) => void;
  activityOptions: { id: WaterActivityLevel; label: string }[];
  suggestedWaterMl: number | null;
};

export function ProfileHealthEditorCard({
  weightText,
  onChangeWeight,
  activityLevel,
  onChangeActivity,
  activityOptions,
  suggestedWaterMl,
}: ProfileHealthEditorCardProps) {
  const { colors, isDark } = useMizoraTheme();

  return (
    <Card className="overflow-hidden p-0">
      <View className="px-4 py-4" style={{ gap: 10 }}>
        <View style={{ gap: 2 }}>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 14,
              color: colors.textStrong,
              letterSpacing: -0.15,
            }}
          >
            Weight
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 10, color: colors.textMuted }}>
            In kilograms
          </Text>
        </View>
        <View
          className="flex-row items-center rounded-[14px] px-3.5"
          style={{
            backgroundColor: isDark ? colors.surfaceMuted : colors.surfaceSecondary,
            borderWidth: 0.67,
            borderColor: colors.borderDivider,
            minHeight: 52,
          }}
        >
          <TextInput
            value={weightText}
            onChangeText={onChangeWeight}
            keyboardType="decimal-pad"
            placeholder="68"
            placeholderTextColor={colors.textMuted}
            style={{
              flex: 1,
              fontFamily: fonts.medium,
              fontSize: 16,
              color: colors.textStrong,
              paddingVertical: 12,
              letterSpacing: -0.2,
            }}
          />
          <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.textMuted }}>
            kg
          </Text>
        </View>
      </View>

      <CardInsetDivider />

      <View className="px-4 py-4" style={{ gap: 10 }}>
        <View style={{ gap: 2 }}>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 14,
              color: colors.textStrong,
              letterSpacing: -0.15,
            }}
          >
            Activity level
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 10, color: colors.textMuted }}>
            Helps estimate your water target
          </Text>
        </View>
        <ActivityLevelChips
          embedded
          value={activityLevel}
          onChange={onChangeActivity}
          options={activityOptions}
        />
      </View>

      {suggestedWaterMl ? (
        <>
          <CardInsetDivider />
          <View
            className="mx-4 mb-4 mt-1 flex-row items-end justify-between rounded-[14px] px-3.5 py-3"
            style={{
              backgroundColor: isDark ? 'rgba(200, 245, 38, 0.1)' : '#f5ffbb',
              borderWidth: 0.67,
              borderColor: isDark ? 'rgba(200, 245, 38, 0.35)' : '#ddfb43',
            }}
          >
            <View style={{ gap: 2 }}>
              <Text style={{ fontFamily: fonts.regular, fontSize: 10, color: colors.textMuted }}>
                Suggested daily water
              </Text>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 22,
                  color: colors.textStrong,
                  letterSpacing: -0.3,
                }}
              >
                {formatLitersFromMl(suggestedWaterMl)}
              </Text>
            </View>
            <View
              className="rounded-full px-2 py-0.5"
              style={{ backgroundColor: isDark ? 'rgba(200, 245, 38, 0.2)' : '#e4ffb8' }}
            >
              <Text style={{ fontFamily: fonts.medium, fontSize: 8, color: '#5c6d05' }}>
                ESTIMATE
              </Text>
            </View>
          </View>
        </>
      ) : null}
    </Card>
  );
}
