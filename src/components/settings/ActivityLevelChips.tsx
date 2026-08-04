import { Pressable, Text, View } from 'react-native';

import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon';
import { Card } from '@/components/ui/Card';
import { CardInsetDivider } from '@/components/ui/CardInsetDivider';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import type { WaterActivityLevel } from '@/lib/water-recommendation';
import { fonts } from '@/theme/tokens';

type ActivityLevelChipsProps = {
  options: { id: WaterActivityLevel; label: string }[];
  value: WaterActivityLevel;
  onChange: (id: WaterActivityLevel) => void;
  /** List rows + inset dividers (health profile card) */
  embedded?: boolean;
};

function ActivityLevelList({
  options,
  value,
  onChange,
}: Omit<ActivityLevelChipsProps, 'embedded'>) {
  const { colors, isDark } = useMizoraTheme();
  const checkColor = isDark ? '#c8f526' : '#34c759';

  return (
    <View>
      {options.map((opt, index) => {
        const selected = opt.id === value;
        return (
          <View key={opt.id}>
            {index > 0 ? <CardInsetDivider /> : null}
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChange(opt.id)}
              className="flex-row items-center justify-between py-3.5"
              style={({ pressed }) => (pressed ? { opacity: 0.75 } : undefined)}
            >
              <Text
                style={{
                  fontFamily: selected ? fonts.bold : fonts.medium,
                  fontSize: 14,
                  color: selected ? colors.textStrong : colors.textSecondary,
                  letterSpacing: -0.1,
                  flex: 1,
                  paddingRight: 12,
                }}
              >
                {opt.label}
              </Text>
              <View style={{ width: 22, alignItems: 'center' }}>
                {selected ? <CheckmarkIcon size={20} color={checkColor} /> : null}
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

export function ActivityLevelChips({
  options,
  value,
  onChange,
  embedded,
}: ActivityLevelChipsProps) {
  if (embedded) {
    return <ActivityLevelList options={options} value={value} onChange={onChange} />;
  }

  return (
    <Card className="overflow-hidden px-4 py-1">
      <ActivityLevelList options={options} value={value} onChange={onChange} />
    </Card>
  );
}
