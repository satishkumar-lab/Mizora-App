import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { LayoutAnimation, Platform, Pressable, Text, UIManager, View } from 'react-native';

import { SettingsGroupDivider } from '@/components/settings/SettingsGroupDivider';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type HelpFaqItem = {
  q: string;
  a: string;
};

type HelpFaqAccordionProps = {
  items: readonly HelpFaqItem[];
};

function FaqAccordionRow({
  question,
  answer,
  expanded,
  onToggle,
  isLast,
}: {
  question: string;
  answer: string;
  expanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  const { colors } = useMizoraTheme();

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={onToggle}
        className="flex-row items-start gap-2 px-4 py-3.5"
        style={({ pressed }) => ({ opacity: pressed ? 0.72 : 1 })}
      >
        <Text
          className="min-w-0 flex-1"
          style={{
            fontFamily: fonts.medium,
            fontSize: 14,
            color: colors.textStrong,
            letterSpacing: -0.15,
            lineHeight: 20,
            paddingTop: 1,
          }}
        >
          {question}
        </Text>
        <View
          style={{
            transform: [{ rotate: expanded ? '180deg' : '0deg' }],
            marginTop: 2,
          }}
        >
          <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
        </View>
      </Pressable>
      {expanded ? (
        <View
          className="px-4"
          style={{
            paddingBottom: isLast ? 16 : 14,
            paddingTop: 0,
            marginTop: -4,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 12,
              color: colors.textSecondary,
              lineHeight: 18,
            }}
          >
            {answer}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

/** Tap-to-expand FAQ rows inside a settings card. */
export function HelpFaqAccordion({ items }: HelpFaqAccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(() => new Set());

  const toggle = useCallback((index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  return (
    <>
      {items.map((item, index) => (
        <View key={item.q}>
          {index > 0 ? <SettingsGroupDivider /> : null}
          <FaqAccordionRow
            question={item.q}
            answer={item.a}
            expanded={openIndexes.has(index)}
            onToggle={() => toggle(index)}
            isLast={index === items.length - 1}
          />
        </View>
      ))}
    </>
  );
}
