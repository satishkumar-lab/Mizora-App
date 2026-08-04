import Svg, { Path, Rect } from 'react-native-svg';

import { BACK_CHEVRON_COLOR } from '@/components/icons/BackChevronIcon';

type BlockedAppsManageIconProps = {
  size?: number;
  color?: string;
};

/** App tile + lock — stroke matches BackChevronIcon / CalendarOutlineIcon. */
export function BlockedAppsManageIcon({
  size = 20,
  color = BACK_CHEVRON_COLOR,
}: BlockedAppsManageIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={7} y={3.5} width={10} height={17} rx={2.5} stroke={color} strokeWidth={1.5} />
      <Path
        d="M10.5 12V10a1.75 1.75 0 013.5 0v2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Rect x={9.5} y={12} width={5} height={4.5} rx={1} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}
