import { DeviceFrame } from '@/components/device/DeviceFrame';
import { ScreenSlot } from '@/components/device/ScreenSlot';
import type { ScreenKey } from '@/lib/product-screens';

type PhoneSize = 'sm' | 'md' | 'lg' | 'hero';

const SIZE_WIDTH: Record<PhoneSize, number> = {
  sm: 220,
  md: 260,
  lg: 300,
  hero: 328,
};

type PhoneShowcaseProps = {
  screen: ScreenKey;
  size?: PhoneSize;
  className?: string;
  float?: boolean;
};

export function PhoneShowcase({
  screen,
  size = 'md',
  className = '',
  float = false,
}: PhoneShowcaseProps) {
  return (
    <div className={`${float ? 'phone-float' : ''} ${className}`}>
      <DeviceFrame width={SIZE_WIDTH[size]}>
        <ScreenSlot screen={screen} />
      </DeviceFrame>
    </div>
  );
}
