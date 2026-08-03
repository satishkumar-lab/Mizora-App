import { Ionicons } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';
import Svg, { Path, type PathProps } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

import { Card } from '@/components/ui/Card';
import { fonts } from '@/theme/tokens';

export type OnboardingVisualId = 'welcome' | 'lock' | 'track' | 'profile';

type OnboardingSlideVisualProps = {
  id: OnboardingVisualId;
};

const RING_TRACK_PATH =
  'M18.5214 110.5C9.13313 99.2031 3.5 84.7596 3.5 69.0198C3.5 32.8342 33.2731 3.5 70 3.5C106.727 3.5 136.5 32.8342 136.5 69.0198C136.5 84.7596 130.867 99.2031 121.479 110.5';

function FloatingChip({
  label,
  icon,
  style,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  style?: object;
}) {
  return (
    <View
      className="flex-row items-center gap-1.5 rounded-full border border-white/80 bg-white/90 px-3 py-2"
      style={[
        {
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={14} color="#34c759" />
      <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: '#141c12' }}>{label}</Text>
    </View>
  );
}

function WelcomeVisual() {
  const progressPathProps = {
    d: RING_TRACK_PATH,
    stroke: '#DDFB43',
    strokeWidth: 7,
    strokeLinecap: 'round' as const,
    fill: 'none',
    strokeDasharray: '236 236',
    strokeDashoffset: 236 * (1 - 0.72),
  } as PathProps;

  return (
    <View className="w-full items-center px-2">
      <FloatingChip
        label="7-day streak"
        icon="flame"
        style={{ position: 'absolute', left: 0, top: 8, zIndex: 2 }}
      />
      <FloatingChip
        label="Unlock ready"
        icon="key"
        style={{ position: 'absolute', right: 0, top: 48, zIndex: 2 }}
      />

      <View
        className="mt-6 w-full items-center rounded-[28px] border border-white/70 bg-white/60 px-4 pb-5 pt-8"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.06,
          shadowRadius: 24,
        }}
      >
        <Text
          style={{ fontFamily: fonts.black, fontSize: 34, letterSpacing: -1, color: '#141c12' }}
        >
          Mizora
        </Text>
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: 12,
            color: '#5c6d05',
            marginTop: 4,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          Screen time → real wins
        </Text>

        <View className="mt-4" style={{ width: 160, height: 130 }}>
          <Svg width={160} height={130} viewBox="0 0 140 114">
            <Path
              d={RING_TRACK_PATH}
              stroke="#EBEFEA"
              strokeWidth={7}
              strokeLinecap="round"
              fill="none"
            />
            <Path {...progressPathProps} />
          </Svg>
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 42,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontFamily: fonts.bold, fontSize: 22, color: '#000' }}>6,420</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: '#626b5e' }}>steps</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function LockVisual() {
  const apps = [
    { name: 'Reels', uri: 'https://www.google.com/s2/favicons?domain=instagram.com&sz=128' },
    { name: 'Shorts', uri: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=128' },
    { name: 'Chat', uri: 'https://www.google.com/s2/favicons?domain=whatsapp.com&sz=128' },
  ];

  return (
    <View className="w-full px-1">
      <View className="relative items-center">
        <View
          className="w-[92%] overflow-hidden rounded-[26px] border border-[#f2f3f0] bg-white p-4"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.08,
            shadowRadius: 20,
            elevation: 5,
          }}
        >
          <View className="mb-3 flex-row items-center justify-between">
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: '#141c12' }}>
              While you focus…
            </Text>
            <View className="flex-row items-center gap-1 rounded-full bg-[#f4f6f3] px-2 py-1">
              <Ionicons name="lock-closed" size={12} color="#626b5e" />
              <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: '#626b5e' }}>
                Locked
              </Text>
            </View>
          </View>
          <View className="gap-2.5">
            {apps.map((app) => (
              <View
                key={app.name}
                className="flex-row items-center justify-between rounded-[14px] bg-[#f4f6f3] px-3 py-2.5"
              >
                <View className="flex-row items-center gap-3">
                  <Image source={{ uri: app.uri }} className="h-9 w-9 rounded-full" />
                  <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: '#141c12' }}>
                    {app.name}
                  </Text>
                </View>
                <View className="h-7 w-7 items-center justify-center rounded-full bg-white">
                  <Ionicons name="lock-closed" size={14} color="#34c759" />
                </View>
              </View>
            ))}
          </View>
          <View
            className="absolute inset-0 items-center justify-center rounded-[26px]"
            style={{ backgroundColor: 'rgba(250, 251, 244, 0.55)' }}
          />
        </View>

        <View
          className="absolute -bottom-6 z-10 w-[88%]"
          style={{
            shadowColor: '#97EC0D',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
          }}
        >
          <LinearGradient colors={['#E8FFB8', '#DDFB43']} style={{ borderRadius: 20, padding: 14 }}>
            <View className="flex-row items-center gap-3">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-white/90">
                <Ionicons name="footsteps" size={22} color="#141c12" />
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: '#141c12' }}>
                  5,000 steps challenge
                </Text>
                <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: '#5c6d05' }}>
                  Unlock all 3 apps for 30 minutes
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#141c12" />
            </View>
          </LinearGradient>
        </View>
      </View>
      <View className="h-8" />
    </View>
  );
}

function TrackVisual() {
  const days = ['M', 'T', 'W', 'T', 'F'];
  return (
    <View
      className="w-full overflow-hidden rounded-[24px] bg-mizora-shell p-1.5"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 18,
      }}
    >
      <Card className="gap-3 p-4">
        <View className="flex-row items-center justify-between">
          <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: '#000' }}>Today</Text>
          <View
            className="flex-row items-center rounded-full px-2 py-1"
            style={{ backgroundColor: 'rgba(215,255,199,0.71)' }}
          >
            <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: '#34c759' }}>Live</Text>
            <View className="ml-1 h-2 w-2 rounded-full bg-mizora-primary" />
          </View>
        </View>

        <View className="flex-row gap-2">
          <View className="flex-1 rounded-[15px] bg-[#fafbf4] p-3">
            <Text style={{ fontFamily: fonts.bold, fontSize: 22, color: '#000' }}>3,245</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: '#626b5e' }}>steps</Text>
            <View className="mt-2 h-1.5 rounded-full bg-mizora-track">
              <View className="h-full w-[32%] rounded-full bg-mizora-accent" />
            </View>
          </View>
          <View className="flex-1 rounded-[15px] bg-[#ebf7ff]/50 p-3">
            <Text style={{ fontFamily: fonts.bold, fontSize: 22, color: '#000' }}>8/10</Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: '#626b5e' }}>
              glasses
            </Text>
            <View className="mt-2 flex-row items-center gap-1">
              <Ionicons name="water" size={14} color="#0a84ff" />
              <Text style={{ fontFamily: fonts.regular, fontSize: 10, color: '#626b5e' }}>
                Almost there
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row justify-between pt-1">
          {days.map((d, i) => (
            <View
              key={`${d}-${i}`}
              className="h-12 w-10 items-center justify-center rounded-[20px]"
              style={{
                backgroundColor: i < 3 ? '#ddfb43' : '#fff',
                borderWidth: i === 3 ? 2 : 0,
                borderColor: '#ddfb43',
              }}
            >
              <Text style={{ fontFamily: fonts.regular, fontSize: 10, color: '#1e2c00' }}>{d}</Text>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}

function ProfileVisual() {
  return (
    <View className="w-full items-center">
      <View className="relative">
        <View
          className="absolute rounded-full opacity-40"
          style={{ top: -12, left: -12, right: -12, bottom: -12, backgroundColor: '#c8f526' }}
        />
        <LinearGradient
          colors={['#D6FF92', '#DDFB43', '#34c759']}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            padding: 4,
          }}
        >
          <View className="h-full w-full items-center justify-center rounded-full bg-white">
            <Ionicons name="happy" size={48} color="#141c12" />
          </View>
        </LinearGradient>
        {[
          { top: -4, left: 20 },
          { top: 12, right: -8 },
          { bottom: 8, left: -6 },
        ].map((pos, i) => (
          <View key={i} className="absolute h-2 w-2 rounded-full bg-[#ddfb43]" style={pos} />
        ))}
      </View>

      <View className="mt-8 w-full flex-row flex-wrap justify-center gap-2">
        {['No spam', 'No paywall', 'No permissions yet'].map((tag) => (
          <View key={tag} className="rounded-full border border-[#ebefea] bg-white px-3 py-1.5">
            <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: '#626b5e' }}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function OnboardingSlideVisual({ id }: OnboardingSlideVisualProps) {
  switch (id) {
    case 'welcome':
      return <WelcomeVisual />;
    case 'lock':
      return <LockVisual />;
    case 'track':
      return <TrackVisual />;
    case 'profile':
      return <ProfileVisual />;
    default:
      return null;
  }
}
