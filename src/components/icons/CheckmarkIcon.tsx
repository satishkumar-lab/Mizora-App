import Svg, { Path } from 'react-native-svg';

type CheckmarkIconProps = {
  size?: number;
  color?: string;
};

/** Rounded stroke check — same weight family as BackChevronIcon / CalendarOutlineIcon. */
export function CheckmarkIcon({ size = 20, color = '#34c759' }: CheckmarkIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 12.5l3.2 3.2L17 9"
        stroke={color}
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
