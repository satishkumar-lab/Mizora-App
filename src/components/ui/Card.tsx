import type { PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';

import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { mizoraCardElevationStyle } from '@/utils/platformStyles';

type CardProps = PropsWithChildren<
  ViewProps & {
    className?: string;
  }
>;

/** White elevated card matching Home screen (15px radius, soft shadow). */
export function Card({ children, className = '', style, ...rest }: CardProps) {
  const { isDark } = useMizoraTheme();

  return (
    <View
      className={`rounded-card bg-mizora-card dark:bg-mizora-card-dark ${className}`}
      style={[mizoraCardElevationStyle(isDark), style]}
      {...rest}
    >
      {children}
    </View>
  );
}
