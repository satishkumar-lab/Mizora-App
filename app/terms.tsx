import { LegalDocumentScreen } from '@/screens/legal/LegalDocumentScreen';

/** Public route — same path as store terms URL after web export (`/terms`). */
export default function TermsOfServiceRoute() {
  return <LegalDocumentScreen documentId="terms" backFallback="/profile" />;
}
