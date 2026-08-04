import Svg, { Path, Rect } from 'react-native-svg';

import { BACK_CHEVRON_COLOR } from '@/components/icons/BackChevronIcon';

type CalendarOutlineIconProps = {
  size?: number;
  color?: string;
};

/** Outline calendar — same stroke weight as BackChevronIcon / ForwardChevronIcon. */
export function CalendarOutlineIcon({
  size = 20,
  color = BACK_CHEVRON_COLOR,
}: CalendarOutlineIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8 3v3M16 3v3M4.5 9h15" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Rect x={4} y={5} width={16} height={15} rx={2.5} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}
