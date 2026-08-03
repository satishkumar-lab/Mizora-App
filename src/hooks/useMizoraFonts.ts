import { useFonts } from 'expo-font';

import { fontUris, fonts } from '@/theme/tokens';

export function useMizoraFonts() {
  const [loaded, error] = useFonts({
    [fonts.regular]: { uri: fontUris.regular },
    [fonts.medium]: { uri: fontUris.medium },
    [fonts.bold]: { uri: fontUris.bold },
    [fonts.black]: { uri: fontUris.black },
  });

  return { loaded, error };
}
