import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname, useRouter, type Href } from 'expo-router';
import { Pressable, View } from 'react-native';

type TabId = 'home' | 'analytics' | 'health' | 'chat';

type MainNavProps = {
  activeTab?: TabId;
  onFabPress?: () => void;
};

const TABS: {
  id: TabId;
  iconActive: keyof typeof Ionicons.glyphMap;
  iconInactive: keyof typeof Ionicons.glyphMap;
  size?: number;
  href?: Href;
}[] = [
  { id: 'home', iconActive: 'home', iconInactive: 'home-outline', href: '/home' },
  { id: 'analytics', iconActive: 'barbell', iconInactive: 'barbell-outline' },
  { id: 'health', iconActive: 'heart', iconInactive: 'heart-outline' },
  {
    id: 'chat',
    iconActive: 'chatbubble-ellipses',
    iconInactive: 'chatbubble-ellipses-outline',
    size: 21,
  },
];

function tabFromPathname(pathname: string): TabId {
  if (
    pathname.startsWith('/home') ||
    pathname.startsWith('/steps') ||
    pathname.startsWith('/streak')
  ) {
    return 'home';
  }
  return 'home';
}

/**
 * Bottom nav — solid “floating pill” (no blur). Real glassmorphism is inconsistent on Android;
 * iOS blur can be added later behind this surface if needed.
 */
export function MainNav({ activeTab, onFabPress }: MainNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const resolvedActive = activeTab ?? tabFromPathname(pathname);

  return (
    <View className="flex-row items-center gap-[15px]">
      <View
        className="flex-row rounded-full p-2"
        style={{
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#f2f2f7',
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.04,
          shadowRadius: 10,
          elevation: 8,
        }}
      >
        {TABS.map((tab) => {
          const isActive = tab.id === resolvedActive;
          const iconName = isActive ? tab.iconActive : tab.iconInactive;
          const iconSize = tab.size ?? 24;

          return (
            <Pressable
              key={tab.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onPress={() => {
                if (tab.href) {
                  router.push(tab.href);
                }
              }}
              className="h-[45px] w-[65px] items-center justify-center rounded-full"
              style={{ backgroundColor: isActive ? '#c8f526' : 'transparent' }}
            >
              <Ionicons name={iconName} size={iconSize} color={isActive ? '#000000' : '#8e8e93'} />
            </Pressable>
          );
        })}
      </View>

      <Pressable accessibilityRole="button" onPress={onFabPress}>
        <LinearGradient
          colors={['rgba(214,255,146,0.85)', 'rgba(151,236,13,0.85)']}
          style={{
            width: 61,
            height: 61,
            borderRadius: 30.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="add" size={29} color="#ffffff" />
        </LinearGradient>
      </Pressable>
    </View>
  );
}
