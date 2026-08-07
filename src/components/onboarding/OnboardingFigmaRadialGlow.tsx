import { useWindowDimensions } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import { FIGMA_ONBOARDING_FRAME_W } from '@/constants/onboardingFigmaAssets';

const GLOW_VIEW_H = 743;
/** Figma `Ellipse 3950` artboard (inset-expanded SVG) */
const GLOW_SVG_W = 778.2;
const GLOW_SVG_H = 1032.2;
const GLOW_CX = 389.1;
const GLOW_CY = 516.1;
const GLOW_RX = 244.5;
const GLOW_RY = 371.5;

/**
 * Soft white field glow from Figma layer blur (`feGaussianBlur` ~72px).
 * RN SVG filters are unreliable — radial fade approximates the same look without a solid white disk.
 */
export function OnboardingFigmaRadialGlow() {
  const { width, height } = useWindowDimensions();
  const s = width / FIGMA_ONBOARDING_FRAME_W;
  const centerX = width / 2;
  const centerY = height / 2;

  const slotH = GLOW_VIEW_H * s;
  const svgW = GLOW_SVG_W * s;
  const svgH = GLOW_SVG_H * s;
  const left = centerX - svgW / 2;
  const top = centerY - slotH / 2 + 0.5 * s + (slotH - svgH) / 2;

  return (
    <Svg
      pointerEvents="none"
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${GLOW_SVG_W} ${GLOW_SVG_H}`}
      style={{ position: 'absolute', left, top, zIndex: 0 }}
    >
      <Defs>
        <RadialGradient
          id="onboardingFigmaGlow"
          cx={GLOW_CX}
          cy={GLOW_CY}
          rx={GLOW_RX * 1.35}
          ry={GLOW_RY * 1.35}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.42} />
          <Stop offset="0.35" stopColor="#FFFFFF" stopOpacity={0.22} />
          <Stop offset="0.65" stopColor="#FFFFFF" stopOpacity={0.08} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse
        cx={GLOW_CX}
        cy={GLOW_CY}
        rx={GLOW_RX}
        ry={GLOW_RY}
        fill="url(#onboardingFigmaGlow)"
      />
    </Svg>
  );
}
