import Image from 'next/image';

type MizoraFullLogoProps = {
  className?: string;
  /** Render width in px; height scales from asset aspect ratio. */
  width?: number;
  priority?: boolean;
};

const LOGO_ASPECT = 248 / 85;

export function MizoraFullLogo({
  className = '',
  width = 132,
  priority = false,
}: MizoraFullLogoProps) {
  const height = Math.round(width / LOGO_ASPECT);

  return (
    <Image
      src="/brand/mizora-full-logo.png"
      alt="Mizora"
      width={width}
      height={height}
      priority={priority}
      className={`h-auto w-auto max-w-full ${className}`}
    />
  );
}
