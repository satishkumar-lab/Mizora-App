import { useFonts } from 'expo-font';

import { satoshiFontAssets } from '@/theme/fontAssets';

export function useMizoraFonts() {
  const [loaded, error] = useFonts(satoshiFontAssets);

  return { loaded, error };
}
