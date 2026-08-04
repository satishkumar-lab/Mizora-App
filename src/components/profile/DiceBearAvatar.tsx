import { createAvatar } from '@dicebear/core';
import * as adventurerStyle from '@dicebear/adventurer';
import * as loreleiStyle from '@dicebear/lorelei';
import { useMemo } from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { DICEBEAR_BACKGROUND_COLORS } from '@/constants/profileAvatars';

type DiceBearAvatarProps = {
  seed: string;
  size: number;
  variant?: 'lorelei' | 'adventurer';
};

const RENDER_SIZE = 256;

export function DiceBearAvatar({ seed, size, variant = 'lorelei' }: DiceBearAvatarProps) {
  const xml = useMemo(() => {
    const options = {
      seed,
      size: RENDER_SIZE,
      backgroundColor: [...DICEBEAR_BACKGROUND_COLORS],
      backgroundType: ['solid' as const],
      radius: 50,
    };

    if (variant === 'adventurer') {
      return createAvatar(adventurerStyle, options).toString();
    }
    return createAvatar(loreleiStyle, options).toString();
  }, [seed, variant]);

  return (
    <View style={{ width: size, height: size, overflow: 'hidden', borderRadius: size / 2 }}>
      <SvgXml xml={xml} width={size} height={size} />
    </View>
  );
}

/** Alternate styles in the picker grid for visual variety. */
export function diceBearVariantForPresetIndex(index: number): 'lorelei' | 'adventurer' {
  return index % 2 === 0 ? 'lorelei' : 'adventurer';
}
