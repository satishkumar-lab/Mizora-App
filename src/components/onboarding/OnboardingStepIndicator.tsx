import { useEffect, useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { LayoutChangeEvent, View } from 'react-native';

type OnboardingStepIndicatorProps = {
  total: number;
  currentIndex: number;
};

export function OnboardingStepIndicator({ total, currentIndex }: OnboardingStepIndicatorProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const fillWidth = useSharedValue(0);

  const progress = (currentIndex + 1) / total;

  useEffect(() => {
    if (trackWidth <= 0) return;
    fillWidth.value = withSpring(trackWidth * progress, { damping: 20, stiffness: 180 });
  }, [trackWidth, progress, fillWidth]);

  const fillStyle = useAnimatedStyle(() => ({
    width: fillWidth.value,
  }));

  const onLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  return (
    <View className="h-1.5 w-full overflow-hidden rounded-full bg-[#e5ece2]" onLayout={onLayout}>
      <Animated.View
        className="h-full rounded-full"
        style={[{ backgroundColor: '#34c759' }, fillStyle]}
      />
    </View>
  );
}
