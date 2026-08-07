import { useCallback, useEffect, useRef } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { fonts } from '@/theme/tokens';

const TICK_W = 12;

type OnboardingHorizontalRulerProps = {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  majorEvery?: number;
  formatLabel?: (n: number) => string;
};

export function OnboardingHorizontalRuler({
  min,
  max,
  step = 1,
  value,
  onChange,
  majorEvery = 10,
  formatLabel = (n) => String(Math.round(n)),
}: OnboardingHorizontalRulerProps) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const fromScrollRef = useRef(false);
  const lastEmittedRef = useRef<number | null>(null);
  const sidePad = width / 2 - TICK_W / 2;
  const count = Math.floor((max - min) / step) + 1;

  const valueFromOffset = useCallback(
    (x: number) => {
      const index = Math.min(count - 1, Math.max(0, Math.round(x / TICK_W)));
      return min + index * step;
    },
    [count, min, step],
  );

  const emitValue = useCallback(
    (next: number) => {
      if (lastEmittedRef.current === next) return;
      lastEmittedRef.current = next;
      onChange(next);
    },
    [onChange],
  );

  const scrollToValue = useCallback(
    (v: number, animated: boolean) => {
      const clamped = Math.min(max, Math.max(min, v));
      const index = Math.round((clamped - min) / step);
      scrollRef.current?.scrollTo({ x: index * TICK_W, animated });
    },
    [max, min, step],
  );

  useEffect(() => {
    if (fromScrollRef.current) return;
    lastEmittedRef.current = value;
    scrollToValue(value, false);
  }, [value, scrollToValue]);

  const onScrollLive = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    fromScrollRef.current = true;
    emitValue(valueFromOffset(e.nativeEvent.contentOffset.x));
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    emitValue(valueFromOffset(e.nativeEvent.contentOffset.x));
    requestAnimationFrame(() => {
      fromScrollRef.current = false;
    });
  };

  return (
    <View style={styles.wrap}>
      <View pointerEvents="none" style={styles.centerNeedle}>
        <View style={styles.needleLine} />
        <View style={styles.needleDot} />
      </View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={TICK_W}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={onScrollLive}
        onMomentumScrollEnd={onScrollEnd}
        onScrollEndDrag={onScrollEnd}
        contentContainerStyle={{ paddingHorizontal: sidePad }}
      >
        <View>
          <View style={styles.track}>
            {Array.from({ length: count }, (_, i) => {
              const major = i % majorEvery === 0;
              return (
                <View key={i} style={[styles.tickSlot, { width: TICK_W }]}>
                  <View style={[styles.tick, major ? styles.tickMajor : styles.tickMinor]} />
                </View>
              );
            })}
          </View>
          <View style={styles.numberTrack}>
            {Array.from({ length: count }, (_, i) => {
              const v = min + i * step;
              const major = i % majorEvery === 0;
              return (
                <View key={`n-${i}`} style={[styles.numberSlot, { width: TICK_W }]}>
                  {major ? (
                    <Text style={styles.numberLabel} numberOfLines={1}>
                      {formatLabel(v)}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 88,
    justifyContent: 'center',
  },
  centerNeedle: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    zIndex: 2,
  },
  needleLine: {
    width: 3,
    height: 46,
    borderRadius: 2,
    backgroundColor: '#141c12',
  },
  needleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#141c12',
    marginTop: -1,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 50,
  },
  tickSlot: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 50,
  },
  tick: {
    width: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(20,28,18,0.22)',
  },
  tickMinor: {
    height: 16,
  },
  tickMajor: {
    height: 30,
    backgroundColor: 'rgba(20,28,18,0.5)',
  },
  numberTrack: {
    flexDirection: 'row',
    height: 18,
    marginTop: 4,
  },
  numberSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberLabel: {
    width: 36,
    marginLeft: -12,
    textAlign: 'center',
    fontFamily: fonts.medium,
    fontSize: 11,
    color: 'rgba(20,28,18,0.45)',
  },
});
