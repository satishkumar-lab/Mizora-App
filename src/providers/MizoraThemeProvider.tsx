import { useColorScheme } from 'nativewind';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { View } from 'react-native';

import { MizoraStatusBar } from '@/components/ui/MizoraStatusBar';
import { loadMizoraTheme } from '@/lib/theme-storage';

/** Restores saved light/dark preference and applies NativeWind color scheme. */
export function MizoraThemeProvider({ children }: PropsWithChildren) {
  const { setColorScheme } = useColorScheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadMizoraTheme()
      .then((saved) => {
        if (!mounted) return;
        if (saved) setColorScheme(saved);
        setReady(true);
      })
      .catch(() => {
        if (mounted) setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, [setColorScheme]);

  if (!ready) {
    return <View className="flex-1 bg-mizora-bg dark:bg-mizora-bg-dark" />;
  }

  return (
    <>
      <MizoraStatusBar />
      {children}
    </>
  );
}
