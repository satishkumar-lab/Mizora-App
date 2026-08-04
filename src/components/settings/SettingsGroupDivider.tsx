import { CardInsetDivider } from '@/components/ui/CardInsetDivider';

type SettingsGroupDividerProps = {
  inset?: boolean;
};

export function SettingsGroupDivider({ inset = true }: SettingsGroupDividerProps) {
  if (inset) {
    return <CardInsetDivider />;
  }
  return null;
}
