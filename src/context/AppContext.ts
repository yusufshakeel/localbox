import {createContext, useContext} from 'react';
import {InfoApiResponse} from '@/types/api-responses';
import {WEBSITE_THEME_LIGHT} from '@/constants';

export interface AppContextProps {
  theme: string,
  toggleTheme: () => void,
  userPreferences: any,
  setUserPreferences: (data: any) => void,
  info: InfoApiResponse | undefined,
  ip: string,
  port: string,
  localServerAddress: string
}

const DefaultAppContext = {
  theme: WEBSITE_THEME_LIGHT,
  toggleTheme: () => {},
  userPreferences: {},
  // eslint-disable-next-line
  setUserPreferences: (data: any) => {},
  info: undefined,
  ip: '',
  port: '',
  localServerAddress: ''
};

export const AppContext =
  createContext<AppContextProps>(DefaultAppContext);

export const useAppContext =
  (): AppContextProps => useContext(AppContext);