import { Pressable, Text, type PressableProps } from 'react-native';

import { ForwardChevronIcon } from '@/components/icons/ForwardChevronIcon';
import { fonts } from '@/theme/tokens';

type SectionViewAllLinkProps = PressableProps & {
  label?: string;
};

/** Section header trailing link — compact green label + ForwardChevronIcon. */
export function SectionViewAllLink({ label = 'View All', ...rest }: SectionViewAllLinkProps) {
  return (
    <Pressable
      accessibilityRole="link"
      hitSlop={8}
      className="flex-row items-center"
      style={{ gap: 2, paddingVertical: 6, paddingLeft: 8 }}
      {...rest}
    >
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: 11,
          lineHeight: 13,
          color: '#34c759',
        }}
      >
        {label}
      </Text>
      <ForwardChevronIcon size={14} color="#34c759" />
    </Pressable>
  );
}
