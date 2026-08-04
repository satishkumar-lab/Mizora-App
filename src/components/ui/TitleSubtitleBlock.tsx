import { Text, View } from 'react-native';

import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

type TitleSubtitleBlockProps = {
  title: string;
  subtitle?: string;
  titleSize?: 14 | 16;
  titleColor?: string;
};

/** Tight title + caption stack (avoids card `gap` blowing space between lines). */
export function TitleSubtitleBlock({
  title,
  subtitle,
  titleSize = 14,
  titleColor,
}: TitleSubtitleBlockProps) {
  const { colors } = useMizoraTheme();
  const resolvedTitleColor = titleColor ?? colors.textStrong;
  return (
    <View>
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: titleSize,
          color: resolvedTitleColor,
          lineHeight: titleSize === 16 ? 20 : 18,
        }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={{
            fontFamily: fonts.regular,
            fontSize: 11,
            color: colors.textMuted,
            lineHeight: 14,
            marginTop: 1,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
