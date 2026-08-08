import { MizoraIonIcon } from '@/components/icons/MizoraIonIcon';
import type { IonIconName } from '@/components/icons/tokens';

const NAV_TABS: { label: string; iconActive: IonIconName; iconInactive: IonIconName }[] = [
  { label: 'Home', iconActive: 'home', iconInactive: 'home-outline' },
  { label: 'Steps', iconActive: 'footsteps', iconInactive: 'footsteps' },
  { label: 'Streak', iconActive: 'heart', iconInactive: 'heart-outline' },
  { label: 'Alerts', iconActive: 'notifications', iconInactive: 'notifications-outline' },
];

type MockupMainNavProps = {
  activeIndex?: number;
};

/** Static bottom nav chrome — icon set matches app `MainNav`. */
export function MockupMainNav({ activeIndex = 0 }: MockupMainNavProps) {
  return (
    <div
      aria-hidden="true"
      className="mt-auto flex items-center gap-2 border-t border-[#ededed] bg-[#fafafa]/95 px-2 pt-2 pb-1.5"
    >
      <div className="flex flex-1 flex-row rounded-full border border-[#ededed] bg-white p-1 shadow-[0_0_10px_rgba(15,23,42,0.04)]">
        {NAV_TABS.map((tab, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={tab.label}
              className={`flex h-9 w-[52px] items-center justify-center rounded-full ${
                isActive ? 'bg-[#e4ffb8]' : ''
              }`}
            >
              <MizoraIonIcon
                name={isActive ? tab.iconActive : tab.iconInactive}
                size={index === 3 ? 18 : 20}
                color={isActive ? '#141c12' : '#8e8e93'}
              />
            </div>
          );
        })}
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ededed] bg-white">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#d7ffc7] to-[#34c759] p-[2px]">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#e8f5e0] text-[9px] font-bold text-[#5c6d05]">
            SK
          </div>
        </div>
      </div>
    </div>
  );
}
