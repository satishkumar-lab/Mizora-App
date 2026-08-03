import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';

import { MizoraPlusCrown } from '@/components/icons/MizoraPlusCrown';
import { fonts } from '@/theme/tokens';

export function HomeHeader() {
  return (
    <View className="flex-row items-center justify-between">
      <View>
        <View className="h-11 w-11 overflow-hidden rounded-full border-[1.5px] border-mizora-primary">
          <Image
            source={{ uri: 'https://i.pravatar.cc/200?u=mizora-user' }}
            className="h-full w-full"
          />
        </View>
        <View className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-mizora-bg bg-mizora-primary" />
      </View>

      <View className="flex-row items-center gap-2.5">
        <View className="flex-row items-center gap-1.5 rounded-[10px] bg-mizora-accent-soft px-3 py-2">
          <MizoraPlusCrown size={14} />
          <Text className="text-xs" style={{ fontFamily: fonts.medium, color: '#5c6d05' }}>
            Mizora+
          </Text>
        </View>
        <Pressable className="flex-row items-center gap-1 rounded-[10px] border border-[#ededed] bg-white px-3 py-2">
          <Text className="text-xs text-black" style={{ fontFamily: fonts.medium }}>
            Today
          </Text>
          <Ionicons name="chevron-down" size={14} color="#000" />
        </Pressable>
      </View>
    </View>
  );
}
