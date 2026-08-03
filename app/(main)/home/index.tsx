import { StatusBar } from 'expo-status-bar';

import { HomeScreen } from '@/screens/HomeScreen';

export default function HomeRoute() {
  return (
    <>
      <StatusBar style="dark" />
      <HomeScreen />
    </>
  );
}
