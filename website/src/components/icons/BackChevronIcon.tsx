import { BACK_CHEVRON_COLOR } from '@/components/icons/tokens';

type BackChevronIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export function BackChevronIcon({
  size = 20,
  color = BACK_CHEVRON_COLOR,
  className,
}: BackChevronIconProps) {
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
        d="M14 7L9 12l5 5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
