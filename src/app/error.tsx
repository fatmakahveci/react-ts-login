'use client';
import { usePreferences } from '@/contexts/preferences-context';
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = usePreferences();
  return <section role="alert"><h1>{t('genericError')}</h1>{error.digest && <p>{t('reference')}: {error.digest}</p>}<button onClick={reset}>{t('retry')}</button></section>;
}
