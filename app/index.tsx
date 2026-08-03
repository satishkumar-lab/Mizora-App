import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { getOnboardingComplete } from '@/lib/onboarding-storage';

export default function IndexRoute() {
  const [ready, setReady] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    let mounted = true;
    getOnboardingComplete()
      .then((complete) => {
        if (mounted) {
          setOnboardingComplete(complete);
          setReady(true);
        }
      })
      .catch(() => {
        if (mounted) {
          setOnboardingComplete(false);
          setReady(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-mizora-bg">
        <ActivityIndicator color="#34c759" />
      </View>
    );
  }

  if (!onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/home" />;
}
