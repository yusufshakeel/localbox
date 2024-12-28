import {useState} from 'react';
import useRouter from 'next/router';
import Cookies from 'js-cookie';
import httpClient from '@/api-clients';
import {LoginPayload} from '@/types/login-payload';
import {AuthBaseResponse, AuthLoginApiResponse} from '@/types/api-responses';
import {ACCESS_TOKEN_TTL_IN_MILLISECONDS, REFRESH_TOKEN_TTL_IN_MILLISECONDS} from '@/configs/auth';

const useLogInEffect = () => {
  const [error, setError] = useState('');
  const [response, setResponse] = useState<AuthBaseResponse | null>(null);

  const handleLogin = async ({ username, password, accountType}: LoginPayload) => {
    try {
      const response = await httpClient.post<AuthLoginApiResponse>({
        url: `/api/auth/login`,
        body: { username, password, accountType},
        headers: {'Content-Type': 'application/json'}
      });
      if(response.statusCode === 200 && response.data) {
        Cookies.set(
          'access_token',
          response.data.accessToken || '',
          { secure: false, expires: new Date(Date.now() + ACCESS_TOKEN_TTL_IN_MILLISECONDS)}
        );
        Cookies.set(
          'refresh_token',
          response.data.refreshToken || '',
          { secure: false, expires: new Date(Date.now() + REFRESH_TOKEN_TTL_IN_MILLISECONDS)}
        );
        Cookies.set(
          'account_details',
          JSON.stringify({
            id: response.data.id,
            username: response.data.username,
            accountType: response.data.accountType
          }),
          { secure: false, expires: new Date(Date.now() + ACCESS_TOKEN_TTL_IN_MILLISECONDS)}
        );
        await useRouter.push('/profile');
        setResponse(response.data);
      } else {
        setError('Invalid credentials');
      }
    } catch (error: any) {
      setError(`An error occurred: ${error.message}`);
    }
  };

  return { error, response, handleLogin };
};

export default useLogInEffect;