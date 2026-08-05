import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { Href } from 'expo-router';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { LEGAL_DOCUMENTS, type LegalDocumentId } from '@/constants/legalDocuments';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

type LegalDocumentScreenProps = {
  documentId: LegalDocumentId;
  backFallback?: Href;
};

export function LegalDocumentScreen({
  documentId,
  backFallback = '/profile',
}: LegalDocumentScreenProps) {
  const doc = LEGAL_DOCUMENTS[documentId];
  const insets = useSafeAreaInsets();
  const goBack = useMizoraBack(backFallback);
  const { colors, isDark } = useMizoraTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemedScreen>
        <View className="px-5">
          <ScreenHeader onBack={goBack} title={doc.title} />
        </View>
        <ScrollView
          contentContainerClassName="px-5 pb-8"
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: insets.bottom + MAIN_TAB_BAR_CLEARANCE,
            gap: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted }}>
            Last updated · {doc.lastUpdated}
          </Text>

          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 14,
              color: colors.textSecondary,
              lineHeight: 22,
            }}
          >
            {doc.intro}
          </Text>

          {doc.sections.map((section) => (
            <View key={section.heading} style={{ gap: 8 }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 15,
                  color: colors.textStrong,
                  letterSpacing: -0.2,
                }}
              >
                {section.heading}
              </Text>
              {section.paragraphs.map((paragraph) => (
                <Text
                  key={paragraph}
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 13,
                    color: colors.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  {paragraph}
                </Text>
              ))}
            </View>
          ))}
        </ScrollView>
      </ThemedScreen>
    </>
  );
}
