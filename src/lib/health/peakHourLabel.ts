import type { HourlyStepSlot } from '@/constants/hourlySteps';

function hour12Parts(hour: number): { hour12: number; meridiem: 'AM' | 'PM' } {
  const meridiem: 'AM' | 'PM' = hour < 12 ? 'AM' : 'PM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return { hour12, meridiem };
}

function formatHourLabel(hour: number): string {
  const { hour12, meridiem } = hour12Parts(hour);
  return `${hour12} ${meridiem}`;
}

/** Human-readable range for an hour bucket (e.g. 6–7 AM, 11 AM–12 PM). */
export function formatPeakHourRange(hour: number): string {
  const start = hour12Parts(hour);
  const end = hour12Parts((hour + 1) % 24);
  if (start.meridiem === end.meridiem) {
    return `${start.hour12}–${end.hour12} ${start.meridiem}`;
  }
  return `${formatHourLabel(hour)}–${formatHourLabel((hour + 1) % 24)}`;
}

/**
 * Peak hour from the same hourly slots as the home chart.
 * Ignores future hours; earliest hour wins ties; all-zero → "No Activity".
 */
export function peakHourLabelFromSlots(slots: readonly HourlyStepSlot[], now = new Date()): string {
  const currentHour = now.getHours();
  const eligible = slots.filter((slot) => slot.hour <= currentHour);
  if (eligible.length === 0) {
    return 'No Activity';
  }

  let best = eligible[0]!;
  for (let i = 1; i < eligible.length; i += 1) {
    const slot = eligible[i]!;
    if (slot.steps > best.steps) {
      best = slot;
    } else if (slot.steps === best.steps && slot.hour < best.hour) {
      best = slot;
    }
  }

  if (best.steps <= 0) {
    return 'No Activity';
  }

  return formatPeakHourRange(best.hour);
}
