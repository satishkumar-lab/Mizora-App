import { Linking } from 'react-native';

import { LEGAL } from '@/constants/legal';
import type { Href } from 'expo-router';

export async function openLegalUrl(url: string): Promise<void> {
  const can = await Linking.canOpenURL(url);
  if (can) {
    await Linking.openURL(url);
  }
}

export function legalDocumentHref(kind: 'privacy' | 'terms'): Href {
  return kind === 'privacy' ? LEGAL.privacyPolicyPath : LEGAL.termsOfServicePath;
}

export async function openSupportEmail(): Promise<void> {
  const subject = encodeURIComponent('Mizora support');
  const mailto = `mailto:${LEGAL.supportEmail}?subject=${subject}`;
  await Linking.openURL(mailto);
}

export function openSystemSettings(): void {
  void Linking.openSettings();
}
