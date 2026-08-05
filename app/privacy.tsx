import { LegalDocumentScreen } from '@/screens/legal/LegalDocumentScreen';

/** Public route — same path as store privacy URL after web export (`/privacy`). */
export default function PrivacyPolicyRoute() {
  return <LegalDocumentScreen documentId="privacy" backFallback="/profile" />;
}
