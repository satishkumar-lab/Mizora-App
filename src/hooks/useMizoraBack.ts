import { useRouter, type Href } from 'expo-router';
import { useCallback } from 'react';

/** Safe back — expo-router stack is empty after deep link / redirect. */
export function useMizoraBack(fallback: Href = '/home') {
  const router = useRouter();

  return useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallback);
    }
  }, [router, fallback]);
}
