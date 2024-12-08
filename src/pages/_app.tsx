import '@/styles/globals.css';
import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';
import type { AppProps } from 'next/app';
import {AppContext} from '@/context/AppContext';
import useUserPreferencesEffect from '@/effects/useUserPreferencesEffect';

export default function App({ Component, pageProps }: AppProps) {
  const {userPreferences, setUserPreferences} = useUserPreferencesEffect();

  return (
    <>
      <AppContext.Provider value={{userPreferences, setUserPreferences}}>
        <Component {...pageProps} />
        <ToastContainer/>
      </AppContext.Provider>
    </>
  );
}
