import Svg, { Path } from 'react-native-svg';

type BackChevronIconProps = {
  size?: number;
  color?: string;
};

/** Minimal rounded chevron — no button chrome. */
/** ~60% gray for back chevron (HSL 0 0% 60%). */
export const BACK_CHEVRON_COLOR = '#999999';

export function BackChevronIcon({ size = 24, color = BACK_CHEVRON_COLOR }: BackChevronIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14.5 5.5L8 12l6.5 6.5"
        stroke={color}
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
