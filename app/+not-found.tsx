import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View className="flex-1 items-center justify-center gap-4 bg-[#fafafa] px-6">
        <Text className="text-lg font-semibold text-neutral-900">This route does not exist.</Text>
        <Link href="/">
          <Text className="text-base text-[#34c759]">Go home</Text>
        </Link>
      </View>
    </>
  );
}
