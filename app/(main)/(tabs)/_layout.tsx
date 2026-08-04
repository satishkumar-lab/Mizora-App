import { Tabs } from 'expo-router';

/** Primary app tabs — custom bar is `MainNav` in `(main)/_layout`. */
export default function MainTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        lazy: true,
        freezeOnBlur: true,
      }}
    >
      <Tabs.Screen name="home/index" options={{ title: 'Home' }} />
      <Tabs.Screen name="steps/index" options={{ title: 'Daily progress' }} />
      <Tabs.Screen name="streak/index" options={{ title: 'Streak calendar' }} />
    </Tabs>
  );
}
