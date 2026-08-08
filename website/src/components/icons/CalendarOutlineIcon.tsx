import { BACK_CHEVRON_COLOR } from '@/components/icons/tokens';

type CalendarOutlineIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export function CalendarOutlineIcon({
  size = 20,
  color = BACK_CHEVRON_COLOR,
  className,
}: CalendarOutlineIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path d="M8 3v3M16 3v3M4.5 9h15" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <rect x={4} y={5} width={16} height={15} rx={2.5} stroke={color} strokeWidth={1.5} />
    </svg>
  );
}
