import Svg, { Circle, Path } from 'react-native-svg';

import { BACK_CHEVRON_COLOR } from '@/components/icons/BackChevronIcon';

type SunOutlineIconProps = {
  size?: number;
  color?: string;
};

/** Outline sun — theme / appearance control (same stroke family as CalendarOutlineIcon). */
export function SunOutlineIcon({ size = 20, color = BACK_CHEVRON_COLOR }: SunOutlineIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={4} stroke={color} strokeWidth={1.5} />
      <Path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}
