import { Text, type TextProps } from 'react-native';

import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

type SectionLabelProps = TextProps & {
  children: string;
};

export function SectionLabel({ children, style, ...rest }: SectionLabelProps) {
  const { colors } = useMizoraTheme();
  return (
    <Text
      style={[{ fontFamily: fonts.medium, fontSize: 16, color: colors.textStrong }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}
