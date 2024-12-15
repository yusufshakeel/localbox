import {useEffect, useState} from 'react';
import {USER_PREFERENCE_LOCAL_STORAGE_KEY} from '@/configs/user-preference';

const useUserPreferencesEffect = () => {
  const [userPreferenceInLocalStorage, setUserPreferenceInLocalStorage] = useState({});

  useEffect(() => {
    // initialize user preferences in local storage, if not set before
    try {
      const preferences: any = JSON.parse(localStorage.getItem(USER_PREFERENCE_LOCAL_STORAGE_KEY) || '{}');
      if (!preferences?.updatedAt) {
        localStorage.setItem(
          USER_PREFERENCE_LOCAL_STORAGE_KEY,
          JSON.stringify({ updatedAt: Date.now() })
        );
        setUserPreferenceInLocalStorage({});
      } else {
        setUserPreferenceInLocalStorage(preferences);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: any) {
      setUserPreferenceInLocalStorage({});
    }
  }, []);

  const setUserPreferences = (data: any) => {
    try {
      const dataToUpdate = {
        ...userPreferenceInLocalStorage,
        ...data,
        updatedAt: Date.now()
      };
      localStorage.setItem(
        USER_PREFERENCE_LOCAL_STORAGE_KEY,
        JSON.stringify(dataToUpdate)
      );
      setUserPreferenceInLocalStorage(dataToUpdate);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: any) {
      return {};
    }
  };

  return {
    userPreferences: userPreferenceInLocalStorage,
    setUserPreferences
  };
};

export default useUserPreferencesEffect;