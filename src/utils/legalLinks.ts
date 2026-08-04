import { Linking } from 'react-native';

import { LEGAL } from '@/constants/legal';

export async function openLegalUrl(url: string): Promise<void> {
  const can = await Linking.canOpenURL(url);
  if (can) {
    await Linking.openURL(url);
  }
}

export async function openSupportEmail(): Promise<void> {
  const subject = encodeURIComponent('Mizora support');
  const mailto = `mailto:${LEGAL.supportEmail}?subject=${subject}`;
  await Linking.openURL(mailto);
}

export function openSystemSettings(): void {
  void Linking.openSettings();
}
