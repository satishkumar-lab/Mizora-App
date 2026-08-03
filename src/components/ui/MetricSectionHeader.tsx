import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { fonts } from '@/theme/tokens';

type MetricSectionHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
};

/** Matches home health metric cards — badge + tight title stack */
export function MetricSectionHeader({
  title,
  subtitle,
  icon = <MetricBadgeIcon kind="steps" size={40} />,
  trailing,
}: MetricSectionHeaderProps) {
  return (
    <View className="flex-row items-start justify-between gap-3">
      <View className="flex-1 flex-row items-start gap-2.5">
        {icon}
        <View className="flex-1 shrink pt-0.5">
          <Text
            style={{ fontFamily: fonts.medium, fontSize: 14, color: '#141c12', lineHeight: 18 }}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 11,
                color: '#8e8e93',
                lineHeight: 14,
                marginTop: 1,
              }}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {trailing ? <View className="shrink-0">{trailing}</View> : null}
    </View>
  );
}
