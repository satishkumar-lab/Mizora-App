import Svg, { Path } from 'react-native-svg';

type BackChevronIconProps = {
  size?: number;
  color?: string;
};

/** Secondary text tone — reads lighter than pure gray on white headers. */
export const BACK_CHEVRON_COLOR = '#626b5e';

export function BackChevronIcon({ size = 20, color = BACK_CHEVRON_COLOR }: BackChevronIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 7L9 12l5 5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
