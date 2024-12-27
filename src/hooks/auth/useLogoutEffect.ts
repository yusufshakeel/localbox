import {useState} from 'react';
import {AuthBaseResponse} from '@/types/api-responses';
import httpClient from '@/api-clients';
import Cookies from 'js-cookie';

const useLogoutEffect = () => {
  const [error, setError] = useState('');
  const [response, setResponse] = useState<AuthBaseResponse | null>(null);

  const handleLogout = async () => {
    try {
      setError('');
      setResponse(null);
      const response = await httpClient.post<any>({
        url: `/api/auth/logout`,
        body: { accessToken: Cookies.get('access_token') as string },
        headers: {'Content-Type': 'application/json'}
      });
      if(response.statusCode === 200) {
        Cookies.set('access_token', '', { secure: false, expires: new Date(0) });
        Cookies.set('refresh_token', '', { secure: false, expires: new Date(0) });
        Cookies.set('account_details', '', { secure: false, expires: new Date(0) });
        setResponse(response.data);
      } else {
        setError(response?.message || 'An error occurred');
      }
    } catch (error: any) {
      setError(`An error occurred: ${error.message}`);
    }
  };

  return { error, response, handleLogout };
};

export default useLogoutEffect;