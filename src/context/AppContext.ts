import {createContext, useContext} from 'react';
import {InfoApiResponse} from '@/types/api-responses';

export interface AppContextProps {
  userPreferences: any,
  setUserPreferences: (data: any) => void,
  info: InfoApiResponse | undefined,
  ip: string,
  port: string,
  localServerAddress: string
}

const DefaultAppContext = {
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