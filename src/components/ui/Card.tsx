import type { PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';

import { mizoraCardElevationStyle } from '@/utils/platformStyles';

type CardProps = PropsWithChildren<
  ViewProps & {
    className?: string;
  }
>;

/** White elevated card matching Home screen (15px radius, soft shadow). */
export function Card({ children, className = '', style, ...rest }: CardProps) {
  return (
    <View
      className={`rounded-card bg-mizora-card dark:bg-mizora-card-dark ${className}`}
      style={[mizoraCardElevationStyle(), style]}
      {...rest}
    >
      {children}
    </View>
  );
}
