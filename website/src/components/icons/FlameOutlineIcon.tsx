import { BACK_CHEVRON_COLOR } from '@/components/icons/tokens';

type FlameOutlineIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export function FlameOutlineIcon({
  size = 16,
  color = BACK_CHEVRON_COLOR,
  className,
}: FlameOutlineIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M12 21.5c-2.35 0-4.25-1.85-4.25-4.35 0-1.45.65-2.85 1.7-4.15.55-.75 1.05-1.45 1.35-2.05.3.6.8 1.3 1.35 2.05 1.05 1.3 1.7 2.7 1.7 4.15 0 2.5-1.9 4.35-4.25 4.35Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 21.5V10.5M12 10.5c-1.15-1.65-1.85-3.35-1.85-5.25 0 0 1.35 2.1 1.85 3.75.5-1.65 1.85-3.75 1.85-3.75 0 1.9-.7 3.6-1.85 5.25"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
