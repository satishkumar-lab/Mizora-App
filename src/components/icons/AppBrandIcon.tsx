import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

/** Blocked / unlock app marks — same badge shell pattern as `MetricBadgeIcon`. */
export type AppBrandId = 'whatsapp' | 'instagram' | 'snapchat' | 'youtube';

type BrandPreset = {
  backgroundColor: string;
  iconColor: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const BRANDS: Record<AppBrandId, BrandPreset> = {
  whatsapp: {
    iconColor: '#25D366',
    backgroundColor: '#E8F8EE',
    icon: 'logo-whatsapp',
  },
  instagram: {
    iconColor: '#E1306C',
    backgroundColor: '#FDECF2',
    icon: 'logo-instagram',
  },
  snapchat: {
    iconColor: '#000000',
    backgroundColor: '#FFFC00',
    icon: 'logo-snapchat',
  },
  youtube: {
    iconColor: '#FF0000',
    backgroundColor: '#FFEBEB',
    icon: 'logo-youtube',
  },
};

/** Matches `MetricBadgeIcon` glyph scale. */
function badgeGlyphSize(size: number): number {
  return size <= 24 ? Math.round(size * 0.55) : Math.round(size * 0.5);
}

type AppBrandIconProps = {
  app: AppBrandId;
  size?: number;
};

export function AppBrandIcon({ app, size = 40 }: AppBrandIconProps) {
  const preset = BRANDS[app];
  const glyphSize = badgeGlyphSize(size);

  return (
    <View
      className="items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: preset.backgroundColor,
      }}
    >
      <Ionicons name={preset.icon} size={glyphSize} color={preset.iconColor} />
    </View>
  );
}
