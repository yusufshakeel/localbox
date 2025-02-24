import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';
import type { AppProps } from 'next/app';
import {AppContext} from '@/context/AppContext';
import useUserPreferencesEffect from '@/hooks/useUserPreferencesEffect';
import useInfoEffect from '@/hooks/useInfoEffect';
import useServeIpAddressEffect from '@/hooks/useServeIpAddressEffect';
import { ThemeProvider } from '@/components/theme-provider';
import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const {userPreferences, setUserPreferences} = useUserPreferencesEffect();
  const {info} = useInfoEffect();
  const {ip, port, localServerAddress} = useServeIpAddressEffect();

  return (
    <>
      <SessionProvider session={session}>
        <AppContext.Provider value={{
          userPreferences, setUserPreferences,
          info, ip, port, localServerAddress
        }}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Component {...pageProps} />
            <ToastContainer/>
          </ThemeProvider>
        </AppContext.Provider>
      </SessionProvider>
    </>
  );
}
