import type { ReactNode } from 'react';
import { Text, TextInput, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

type ProfileFormFieldProps = {
  label: string;
  hint?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'decimal-pad';
  trailing?: ReactNode;
};

export function ProfileFormField({
  label,
  hint,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  trailing,
}: ProfileFormFieldProps) {
  const { colors } = useMizoraTheme();

  return (
    <View style={{ gap: 8 }}>
      <View className="px-0.5" style={{ gap: 2 }}>
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: 16,
            color: colors.textStrong,
            letterSpacing: -0.2,
          }}
        >
          {label}
        </Text>
        {hint ? (
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 10,
              color: colors.textMuted,
              lineHeight: 14,
            }}
          >
            {hint}
          </Text>
        ) : null}
      </View>
      <Card className="flex-row items-center px-4 py-1">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          style={{
            flex: 1,
            fontFamily: fonts.medium,
            fontSize: 16,
            color: colors.textStrong,
            paddingVertical: 14,
          }}
        />
        {trailing}
      </Card>
    </View>
  );
}
