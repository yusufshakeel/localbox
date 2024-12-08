import {createContext, useContext} from 'react';

export interface AppContextProps {
  userPreferences: any,
  setUserPreferences: (data: any) => void,
}

const DefaultAppContext = {
  userPreferences: {},
  // eslint-disable-next-line
  setUserPreferences: (data: any) => {}
};

export const AppContext =
  createContext<AppContextProps>(DefaultAppContext);

export const useAppContext =
  (): AppContextProps => useContext(AppContext);