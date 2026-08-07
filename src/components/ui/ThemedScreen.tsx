import type { PropsWithChildren } from 'react';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useMizoraTheme } from '@/hooks/useMizoraTheme';

type ThemedScreenProps = PropsWithChildren<{
  edges?: Edge[];
  className?: string;
}>;

/** App canvas — light/dark background on every screen. */
export function ThemedScreen({ children, edges = ['top'], className = '' }: ThemedScreenProps) {
  const { colors } = useMizoraTheme();

  return (
    <SafeAreaView
      className={`flex-1 bg-mizora-bg dark:bg-mizora-bg-dark ${className}`}
      style={{ backgroundColor: colors.bg }}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}
