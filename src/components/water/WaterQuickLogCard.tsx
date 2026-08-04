import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { WATER_PAGE } from '@/constants/waterTheme';
import { formatLitersValueFromMl } from '@/lib/water-recommendation';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

type WaterQuickLogCardProps = {
  mlPerGlass: number;
  loggedMl: number;
  remainingMl: number;
  onAddMl: (ml: number) => void;
  onRemoveMl: (ml: number) => void;
};

const LOG_ROWS = [
  { ml: 250, label: 'Glass' },
  { ml: 500, label: 'Bottle' },
  { ml: 750, label: 'Large' },
] as const;

function LogStepperRow({
  label,
  amountMl,
  canAdd,
  canRemove,
  onAdd,
  onRemove,
}: {
  label: string;
  amountMl: number;
  canAdd: boolean;
  canRemove: boolean;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const { colors } = useMizoraTheme();
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary }}>
        {label}
      </Text>
      <View className="flex-row items-center gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${amountMl} milliliters`}
          disabled={!canRemove}
          onPress={onRemove}
          className="h-9 w-9 items-center justify-center rounded-full border"
          style={{
            opacity: canRemove ? 1 : 0.4,
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <Ionicons name="remove" size={18} color={WATER_PAGE.icon} />
        </Pressable>
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: 16,
            color: colors.textStrong,
            minWidth: 72,
            textAlign: 'center',
          }}
        >
          {amountMl} ml
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Log ${amountMl} milliliters`}
          disabled={!canAdd}
          onPress={onAdd}
          className="h-9 w-9 items-center justify-center rounded-full border"
          style={{
            opacity: canAdd ? 1 : 0.4,
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <Ionicons name="add" size={18} color={WATER_PAGE.icon} />
        </Pressable>
      </View>
    </View>
  );
}

/** Matches WaterDailyTargetCard — label row + blue ± steppers. */
export function WaterQuickLogCard({
  mlPerGlass,
  loggedMl,
  remainingMl,
  onAddMl,
  onRemoveMl,
}: WaterQuickLogCardProps) {
  const { colors } = useMizoraTheme();
  const atDailyMax = remainingMl <= 0;
  const remainingLine =
    remainingMl > 0 ? `${formatLitersValueFromMl(remainingMl)} L left today. ` : 'Target reached. ';

  const rows = LOG_ROWS.map((row) => ({
    ...row,
    ml: row.ml === 250 ? mlPerGlass : row.ml,
  }));

  return (
    <Card className="gap-3 p-4">
      <View className="flex-row items-center justify-between gap-3">
        <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary }}>
          Log intake
        </Text>
        {remainingMl > 0 ? (
          <Text style={{ fontFamily: fonts.medium, fontSize: 16, color: colors.textStrong }}>
            {formatLitersValueFromMl(remainingMl)} L left
          </Text>
        ) : (
          <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: WATER_PAGE.icon }}>
            Target reached
          </Text>
        )}
      </View>

      <View className="gap-3">
        {rows.map((row) => (
          <LogStepperRow
            key={row.label}
            label={row.label}
            amountMl={row.ml}
            canAdd={!atDailyMax}
            canRemove={loggedMl >= row.ml}
            onAdd={() => onAddMl(row.ml)}
            onRemove={() => onRemoveMl(row.ml)}
          />
        ))}
      </View>

      <Text
        style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted, lineHeight: 16 }}
      >
        {remainingLine}+ logs · − removes · counts toward unlocks on home.
      </Text>
    </Card>
  );
}
