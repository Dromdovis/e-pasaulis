import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { I18nProvider } from '@/lib/i18n/I18nProvider';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';

function App({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </I18nProvider>
  );
}

export default appWithTranslation(App); 