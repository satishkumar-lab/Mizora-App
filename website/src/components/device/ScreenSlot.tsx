import Image from 'next/image';

import { getProductScreen, type ScreenKey } from '@/lib/product-screens';

type ScreenSlotProps = {
  screen: ScreenKey;
  /** Force a mode without changing the registry (useful for A/B while swapping assets). */
  modeOverride?: 'mockup' | 'screenshot';
};

/**
 * Renders either a pixel-faithful UI mockup or a real screenshot.
 * Drop final PNGs into /public/screenshots and set mode: 'screenshot' in the registry.
 */
export function ScreenSlot({ screen, modeOverride }: ScreenSlotProps) {
  const definition = getProductScreen(screen);
  const mode = modeOverride ?? definition.mode;

  if (mode === 'screenshot' && definition.screenshotSrc) {
    return (
      <Image
        src={definition.screenshotSrc}
        alt={definition.alt}
        fill
        className="object-cover object-top"
        sizes="(max-width: 768px) 280px, 320px"
        priority={screen === 'home'}
      />
    );
  }

  if (definition.Mockup) {
    const Mockup = definition.Mockup;
    return (
      <div className="absolute inset-0 overflow-hidden" aria-label={definition.alt}>
        <Mockup />
      </div>
    );
  }

  return (
    <div className="bg-mizora-canvas text-mizora-ink-secondary flex h-full w-full items-center justify-center px-6 text-center text-sm">
      Screenshot coming soon
    </div>
  );
}
