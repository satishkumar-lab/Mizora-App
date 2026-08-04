import { useId } from 'react';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { View } from 'react-native';

import { WATER_VISUAL } from '@/constants/waterTheme';

type WaterVesselVisualProps = {
  /** 0–1 fill level */
  progress: number;
  width?: number;
  height?: number;
};

/**
 * Single hydration vessel — calmer than a row of glass icons; reads as “tank filling up”.
 */
export function WaterVesselVisual({ progress, width = 88, height = 132 }: WaterVesselVisualProps) {
  const clipId = useId();
  const p = Math.min(1, Math.max(0, progress));
  const bodyW = 56;
  const bodyH = 96;
  const offsetX = (width - bodyW) / 2;
  const offsetY = height - bodyH - 8;

  const fillH = bodyH * p;
  const fillY = offsetY + bodyH - fillH;

  return (
    <View style={{ width, height }} accessibilityLabel={`Hydration ${Math.round(p * 100)} percent`}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id={`${clipId}-liquid`} x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0" stopColor={WATER_VISUAL.fill} stopOpacity={0.95} />
            <Stop offset="0.55" stopColor={WATER_VISUAL.fillBright} stopOpacity={0.9} />
            <Stop offset="1" stopColor={WATER_VISUAL.fillGradientTop} stopOpacity={0.85} />
          </LinearGradient>
          <LinearGradient id={`${clipId}-glass`} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#ffffff" stopOpacity={0.5} />
            <Stop offset="0.45" stopColor="#ffffff" stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {/* Neck */}
        <Rect
          x={offsetX + 20}
          y={offsetY - 10}
          width={16}
          height={14}
          rx={4}
          fill={WATER_VISUAL.trackSoft}
          stroke={WATER_VISUAL.border}
          strokeWidth={1}
        />

        {/* Body shell */}
        <Rect
          x={offsetX}
          y={offsetY}
          width={bodyW}
          height={bodyH}
          rx={14}
          fill="#ffffff"
          stroke={WATER_VISUAL.border}
          strokeWidth={1.2}
        />

        {/* Liquid */}
        {p > 0 ? (
          <>
            <Rect
              x={offsetX + 2}
              y={fillY}
              width={bodyW - 4}
              height={fillH}
              rx={12}
              fill={`url(#${clipId}-liquid)`}
            />
            {p > 0.08 ? (
              <Path
                d={`M ${offsetX + 4} ${fillY + 2} Q ${offsetX + bodyW / 2} ${fillY - 5} ${offsetX + bodyW - 4} ${fillY + 2}`}
                fill="none"
                stroke={WATER_VISUAL.fillGradientTop}
                strokeWidth={2}
                opacity={0.7}
              />
            ) : null}
          </>
        ) : null}

        {/* Highlight */}
        <Rect
          x={offsetX + 6}
          y={offsetY + 8}
          width={10}
          height={bodyH - 16}
          rx={5}
          fill={`url(#${clipId}-glass)`}
          opacity={0.6}
        />
      </Svg>
    </View>
  );
}
