import { Text, View } from 'react-native';

import { UnlockRewardsLockedPreview } from '@/components/home/UnlockRewardsLockedPreview';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { mizoraType } from '@/theme/typography';

export { UnlockRewardsListCard } from '@/components/home/UnlockRewardsListCard';
export type { UnlockRewardsListCardProps } from '@/components/home/UnlockRewardsListCard';

export function UnlockRewardsSection() {
  const { colors } = useMizoraTheme();

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ ...mizoraType.sectionTitle, color: colors.textStrong }}>Unlock Rewards</Text>

      <UnlockRewardsLockedPreview />
    </View>
  );
}
