import Svg, { Path } from 'react-native-svg';

import { BACK_CHEVRON_COLOR } from '@/components/icons/BackChevronIcon';

type ForwardChevronIconProps = {
  size?: number;
  color?: string;
};

/** Pair of BackChevronIcon — same stroke, no background. */
export function ForwardChevronIcon({
  size = 20,
  color = BACK_CHEVRON_COLOR,
}: ForwardChevronIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 7l5 5-5 5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
