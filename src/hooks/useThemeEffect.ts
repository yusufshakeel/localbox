import {useEffect, useState} from 'react';
import {WEBSITE_THEME_DARK, WEBSITE_THEME_LIGHT} from '@/constants';
import {THEME_CURRENT_APP_THEME} from '@/configs/theme';

type PropType = {
  userPreferences: any,
  setUserPreferences: (data: any) => void,
};

const useThemeEffect = ({userPreferences, setUserPreferences}: PropType) => {
  const [theme, setTheme] =
    useState(WEBSITE_THEME_LIGHT);

  const setBodyAttribute = (value: string) => {
    document.body.setAttribute('data-bs-theme', value);
  };

  useEffect(() => {
    if (userPreferences[THEME_CURRENT_APP_THEME]) {
      setTheme(userPreferences[THEME_CURRENT_APP_THEME]);
      setBodyAttribute(userPreferences[THEME_CURRENT_APP_THEME]);
    } else {
      setTheme(WEBSITE_THEME_LIGHT);
      setBodyAttribute(WEBSITE_THEME_LIGHT);
    }
  }, [userPreferences]);

  const toggleTheme = () => {
    if (theme === WEBSITE_THEME_LIGHT) {
      setTheme(WEBSITE_THEME_DARK);
      setBodyAttribute(WEBSITE_THEME_DARK);
      setUserPreferences({ [THEME_CURRENT_APP_THEME]: WEBSITE_THEME_DARK });
    } else {
      setTheme(WEBSITE_THEME_LIGHT);
      setBodyAttribute(WEBSITE_THEME_LIGHT);
      setUserPreferences({ [THEME_CURRENT_APP_THEME]: WEBSITE_THEME_LIGHT });
    }
  };

  return {theme, toggleTheme};
};

export default useThemeEffect;