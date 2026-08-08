import { MizoraIonIcon } from '@/components/icons/MizoraIonIcon';
import { METRIC_BADGE_PRESETS, type MetricBadgeKind } from '@/components/icons/tokens';

type MetricBadgeIconProps = {
  kind: MetricBadgeKind;
  size?: number;
  appearance?: 'default' | 'read';
  className?: string;
};

/** Health metric badge family — mirrors app `MetricBadgeIcon`. */
export function MetricBadgeIcon({
  kind,
  size = 40,
  appearance = 'default',
  className = '',
}: MetricBadgeIconProps) {
  const preset = METRIC_BADGE_PRESETS[kind];
  const isRead = appearance === 'read';
  const glyphSize = size <= 24 ? Math.round(size * 0.55) : 20;

  const backgroundColor = isRead ? '#f4f6f3' : preset.backgroundColor;
  const iconColor = isRead ? '#626b5e' : preset.iconColor;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor,
        border: isRead ? '1px solid #ebefea' : undefined,
      }}
    >
      <MizoraIonIcon name={preset.icon} size={glyphSize} color={iconColor} />
    </span>
  );
}
