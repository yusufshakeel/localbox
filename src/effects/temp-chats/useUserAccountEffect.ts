import {useEffect, useState} from 'react';
import {useAppContext} from '@/context/AppContext';
import {
  TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME,
  TEMP_CHATS_MESSAGES_USER_ID,
  TEMP_CHATS_MESSAGES_USER_LOGGED_IN
} from '@/configs/temp-chats';
import {getUUID} from '@/utils/uuid';

const useUserAccountEffect = () => {
  const [displayName, setDisplayName] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [deleteAccountCode, setDeleteAccountCode] = useState('');
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const {userPreferences, setUserPreferences} = useAppContext();

  useEffect(() => {
    if(userPreferences[TEMP_CHATS_MESSAGES_USER_ID]
      && userPreferences[TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME]
    ) {
      setDisplayName(userPreferences[TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME]);
      setUserId(userPreferences[TEMP_CHATS_MESSAGES_USER_ID]);
      setIsProfileCreated(true);

      if(userPreferences[TEMP_CHATS_MESSAGES_USER_LOGGED_IN]) {
        setIsLoggedIn(true);
      }
    }
  }, [userPreferences]);

  const joinChat = () => {
    if(displayName.trim()) {
      const id = getUUID();
      setUserPreferences({
        [TEMP_CHATS_MESSAGES_USER_ID]: id,
        [TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME]: displayName,
        [TEMP_CHATS_MESSAGES_USER_LOGGED_IN]: true
      });
      setUserId(id);
      setIsLoggedIn(true);
      setIsProfileCreated(true);
    }
  };

  const logOut = () => {
    setUserPreferences({
      [TEMP_CHATS_MESSAGES_USER_LOGGED_IN]: false
    });
    setIsLoggedIn(false);
  };

  const logIn = () => {
    setUserPreferences({
      [TEMP_CHATS_MESSAGES_USER_LOGGED_IN]: true
    });
    setIsLoggedIn(true);
  }

  const deleteAccount = () => {
    setUserPreferences({
      [TEMP_CHATS_MESSAGES_USER_ID]: null,
      [TEMP_CHATS_MESSAGES_USER_DISPLAY_NAME]: null,
      [TEMP_CHATS_MESSAGES_USER_LOGGED_IN]: null
    });
    setIsLoggedIn(false);
    setIsProfileCreated(false);
  }

  const generateDeleteAccountCode = (): string => {
    const code = (Math.random()).toString().substring(2, 8);
    setDeleteAccountCode(code);
    return code;
  }

  return {
    displayName,
    setDisplayName,
    userId,
    isLoggedIn,
    isProfileCreated,
    joinChat,
    logOut,
    logIn,
    deleteAccount,
    deleteAccountCode,
    generateDeleteAccountCode
  }
};

export default useUserAccountEffect;