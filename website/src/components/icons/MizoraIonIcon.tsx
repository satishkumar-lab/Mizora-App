import type { IconType } from 'react-icons';
import {
  IoAdd,
  IoFlag,
  IoFlame,
  IoFootsteps,
  IoHeart,
  IoHeartOutline,
  IoHome,
  IoHomeOutline,
  IoKey,
  IoLayers,
  IoNavigate,
  IoNotifications,
  IoNotificationsOutline,
  IoRemove,
  IoTimer,
  IoWater,
} from 'react-icons/io5';

import type { IonIconName } from '@/components/icons/tokens';

const ION_MAP: Record<IonIconName, IconType> = {
  home: IoHome,
  'home-outline': IoHomeOutline,
  footsteps: IoFootsteps,
  heart: IoHeart,
  'heart-outline': IoHeartOutline,
  notifications: IoNotifications,
  'notifications-outline': IoNotificationsOutline,
  flame: IoFlame,
  water: IoWater,
  flag: IoFlag,
  key: IoKey,
  navigate: IoNavigate,
  timer: IoTimer,
  layers: IoLayers,
  add: IoAdd,
  remove: IoRemove,
};

type MizoraIonIconProps = {
  name: IonIconName;
  size?: number;
  color?: string;
  className?: string;
};

/** Ionicons used in the Mizora app (`@expo/vector-icons` / Ionicons glyph names). */
export function MizoraIonIcon({
  name,
  size = 20,
  color = 'currentColor',
  className,
}: MizoraIonIconProps) {
  const Icon = ION_MAP[name];
  return <Icon size={size} color={color} className={className} aria-hidden />;
}
