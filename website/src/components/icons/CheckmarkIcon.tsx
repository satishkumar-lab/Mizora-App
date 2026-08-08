type CheckmarkIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export function CheckmarkIcon({ size = 20, color = '#34c759', className }: CheckmarkIconProps) {
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
        d="M7 12.5l3.2 3.2L17 9"
        stroke={color}
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
