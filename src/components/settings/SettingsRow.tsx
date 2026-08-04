import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ForwardChevronIcon } from '@/components/icons/ForwardChevronIcon';
import { Card } from '@/components/ui/Card';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

type SettingsRowProps = {
  label: string;
  subtitle?: string;
  /** Short trailing text (e.g. Light / Dark) — hidden when `detail` is set */
  value?: string;
  /** Second line under title (e.g. health summary) — left aligned */
  detail?: string;
  onPress?: () => void;
  leading?: ReactNode;
  trailing?: ReactNode;
  destructive?: boolean;
  showChevron?: boolean;
  isLast?: boolean;
  disabled?: boolean;
};

export function SettingsRow({
  label,
  subtitle,
  value,
  detail,
  onPress,
  leading,
  trailing,
  destructive,
  showChevron = Boolean(onPress),
  isLast,
  disabled,
}: SettingsRowProps) {
  const { colors } = useMizoraTheme();
  const labelColor = destructive ? '#ff3b30' : colors.textStrong;
  const hasSecondaryBlock = Boolean(subtitle || detail);
  const showTrailingValue = Boolean(value && !detail);

  const content = (
    <View
      className="flex-row gap-3 px-4"
      style={{
        paddingTop: hasSecondaryBlock ? 14 : 12,
        paddingBottom: isLast ? (hasSecondaryBlock ? 14 : 12) : hasSecondaryBlock ? 14 : 12,
        minHeight: 48,
        alignItems: hasSecondaryBlock ? 'flex-start' : 'center',
        opacity: disabled ? 0.45 : 1,
      }}
    >
      {leading ? <View className="pt-0.5">{leading}</View> : null}

      <View className="min-w-0 flex-1" style={{ gap: 3 }}>
        <Text
          style={{ fontFamily: fonts.bold, fontSize: 14, color: labelColor, letterSpacing: -0.15 }}
        >
          {label}
        </Text>
        {subtitle ? (
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 10,
              color: colors.textMuted,
              lineHeight: 14,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
        {detail ? (
          <Text
            numberOfLines={2}
            style={{
              fontFamily: fonts.medium,
              fontSize: 10,
              color: colors.textSecondary,
              lineHeight: 14,
            }}
          >
            {detail}
          </Text>
        ) : null}
      </View>

      <View
        className="flex-row items-center gap-1"
        style={{
          paddingTop: hasSecondaryBlock ? 2 : 0,
          alignSelf: hasSecondaryBlock ? 'flex-start' : 'center',
        }}
      >
        {showTrailingValue ? (
          <Text
            numberOfLines={1}
            style={{
              fontFamily: fonts.medium,
              fontSize: 12,
              color: colors.textMuted,
              maxWidth: 72,
            }}
          >
            {value}
          </Text>
        ) : null}
        {trailing}
        {showChevron && onPress ? <ForwardChevronIcon size={16} color={colors.textMuted} /> : null}
      </View>
    </View>
  );

  if (!onPress || disabled) {
    return content;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => (pressed ? { opacity: 0.78 } : undefined)}
    >
      {content}
    </Pressable>
  );
}

type SettingsSectionProps = {
  title?: string;
  footer?: string;
  children: ReactNode;
};

export function SettingsSection({ title, footer, children }: SettingsSectionProps) {
  const { colors } = useMizoraTheme();

  return (
    <View style={{ gap: 10 }}>
      {title ? (
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: 16,
            color: colors.textStrong,
            letterSpacing: -0.2,
            paddingHorizontal: 2,
          }}
        >
          {title}
        </Text>
      ) : null}
      <Card className="overflow-hidden p-0">{children}</Card>
      {footer ? (
        <Text
          style={{
            fontFamily: fonts.regular,
            fontSize: 10,
            color: colors.textMuted,
            paddingHorizontal: 4,
            lineHeight: 15,
          }}
        >
          {footer}
        </Text>
      ) : null}
    </View>
  );
}

/** FAQ / privacy copy block inside a card. */
export function SettingsTextBlock({ title, body }: { title: string; body: string }) {
  const { colors } = useMizoraTheme();

  return (
    <View className="px-4 py-3.5" style={{ gap: 4 }}>
      <Text
        style={{
          fontFamily: fonts.bold,
          fontSize: 14,
          color: colors.textStrong,
          letterSpacing: -0.15,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: fonts.regular,
          fontSize: 12,
          color: colors.textSecondary,
          lineHeight: 18,
        }}
      >
        {body}
      </Text>
    </View>
  );
}

type ProfilePrimaryButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'destructive';
  disabled?: boolean;
};

export function ProfilePrimaryButton({
  label,
  onPress,
  variant = 'primary',
  disabled,
}: ProfilePrimaryButtonProps) {
  const isDestructive = variant === 'destructive';
  /** Mizora lime — matches nav pill / brand accent (not black in light mode). */
  const primaryBg = '#c8f526';
  const primaryText = '#141c12';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className="items-center rounded-full py-3.5"
      style={{
        backgroundColor: isDestructive ? '#ff3b30' : primaryBg,
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.bold,
          fontSize: 14,
          color: isDestructive ? '#ffffff' : primaryText,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
