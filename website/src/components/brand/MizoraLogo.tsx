type MizoraLogoProps = {
  className?: string;
  /** Wordmark + runner lockup width in px (approx). */
  width?: number;
  runnerVariant?: 'black' | 'lime';
};

const RUNNER_VIEW_W = 119.515;
const RUNNER_VIEW_H = 85.0627;
const LOCKUP_W = 247.515;

export function MizoraLogo({
  className = '',
  width = 120,
  runnerVariant = 'lime',
}: MizoraLogoProps) {
  const scale = width / LOCKUP_W;
  const runnerWidth = RUNNER_VIEW_W * scale;
  const runnerHeight = RUNNER_VIEW_H * scale;
  const fontSize = 49.939 * scale;
  const gap = 4 * scale;
  const runnerFill = runnerVariant === 'lime' ? '#C1FD3A' : '#000000';

  return (
    <span
      className={`text-mizora-ink inline-flex items-center ${className}`}
      style={{ width, gap }}
      aria-label="Mizora"
    >
      <span className="leading-none font-bold tracking-[-0.02em]" style={{ fontSize }}>
        Mizora
      </span>
      <svg
        width={runnerWidth}
        height={runnerHeight}
        viewBox={`0 0 ${RUNNER_VIEW_W} ${RUNNER_VIEW_H}`}
        aria-hidden="true"
      >
        <path
          d="M61.711 41.2895C62.0169 41.2125 61.8735 41.1994 62.1564 41.3197C63.0627 42.5372 63.884 43.8825 64.7493 45.1448L71.2458 54.6738L77.5383 63.9034C78.6897 65.5891 80.4519 67.9913 81.3915 69.8524C81.4828 70.0332 81.3588 70.1419 81.2518 70.3209C80.1274 71.1082 67.4489 74.6388 65.4332 75.2348L47.4255 80.635L38.0312 83.4393C36.8703 83.7953 32.1873 85.4898 31.4531 84.9614C31.5607 84.3733 32.7377 83.7198 33.243 83.3942C42.5715 77.46 52.4859 71.3799 61.6555 65.3003C60.9379 64.8317 59.5594 63.5034 58.8669 62.8747L54.1156 58.5778C48.6547 53.6502 42.9497 48.648 37.609 43.6233C45.365 43.2599 53.7649 41.8486 61.711 41.2895Z"
          fill={runnerFill}
        />
        <path
          d="M65.704 0C66.1502 0.11402 73.0939 8.00697 73.9153 8.92668C71.0039 16.0912 67.8808 23.581 65.1294 30.7748C63.4292 25.1834 61.693 19.6029 59.9218 14.0335C59.0858 14.5236 55.836 15.4916 54.7573 15.8333L43.5261 19.422C42.0247 19.9117 37.1426 21.5797 35.8298 21.695L35.6797 21.5623C35.7324 20.7613 39.9892 18.0243 40.8643 17.4088L48.8757 11.7744C54.1975 8.03064 60.3121 3.51535 65.704 0Z"
          fill={runnerFill}
        />
        <path
          d="M33.3991 44.6623C33.8593 44.9874 39.8902 60.9798 40.5809 62.9478C36.6311 66.4065 31.8361 69.7495 28.0081 73.1843C26.5359 72.8204 24.3318 72.4621 22.7863 72.1703L10.5713 69.9366C9.36834 69.736 0.364366 68.1994 0.0363899 67.8361C0.00619493 67.4759 -0.0510426 67.5068 0.0982425 67.257C1.31483 66.8638 5.30114 66.2532 6.72695 65.963C12.6932 64.7487 19.1298 63.8765 25.0676 62.6391C25.4462 61.5949 26.666 59.1493 27.1696 58.0767L31.0254 49.8727C31.7896 48.2468 32.7472 46.3053 33.3991 44.6623Z"
          fill={runnerFill}
        />
      </svg>
    </span>
  );
}
