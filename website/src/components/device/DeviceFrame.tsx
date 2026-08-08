import type { ReactNode } from 'react';

type DeviceFrameProps = {
  children: ReactNode;
  className?: string;
  /** Visual scale of the device (width in px at 1x design). */
  width?: number;
};

/**
 * Reusable iPhone chrome. Screen content is always passed as children
 * via ScreenSlot — never hardcode screenshots here.
 */
export function DeviceFrame({ children, className = '', width = 300 }: DeviceFrameProps) {
  const radius = Math.round(width * 0.14);
  const bezel = Math.max(10, Math.round(width * 0.035));
  const islandW = Math.round(width * 0.32);
  const islandH = Math.round(width * 0.075);

  return (
    <div
      className={`relative ${className}`}
      style={{
        width,
        borderRadius: radius,
        padding: bezel,
        background: 'linear-gradient(165deg, #2a2a2c 0%, #0c0c0d 45%, #1a1a1c 100%)',
        boxShadow: 'var(--shadow-phone)',
      }}
    >
      <div
        className="bg-mizora-canvas relative overflow-hidden"
        style={{
          borderRadius: radius - bezel * 0.55,
          aspectRatio: '390 / 844',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black"
          style={{ width: islandW, height: islandH }}
        />
        <div className="absolute inset-0">{children}</div>
      </div>
    </div>
  );
}
