import {useState} from 'react';
import {AuthBaseResponse} from '@/types/api-responses';
import httpClient from '@/api-clients';
import useRouter from 'next/router';
import Cookies from 'js-cookie';
import showToast from '@/utils/show-toast';

const useLogoutEffect = () => {
  const [error, setError] = useState('');
  const [response, setResponse] = useState<AuthBaseResponse | null>(null);

  const handleLogout = async () => {
    try {
      const response = await httpClient.post<any>({
        url: `/api/auth/logout`,
        body: { accessToken: Cookies.get('access_token') },
        headers: {'Content-Type': 'application/json'}
      });
      if(response.statusCode === 200 && response.data.isValid) {
        Cookies.set('access_token', '', { secure: false, expires: new Date(0) });
        Cookies.set('refresh_token', '', { secure: false, expires: new Date(0) });
        Cookies.set('account_details', '', { secure: false, expires: new Date(0) });
        await useRouter.push('/');
        setResponse(response.data);
      } else {
        setError('Invalid credentials');
        showToast({ content: 'Access token missing', type: 'error', autoClose: 1000 });
      }
    } catch (error: any) {
      setError(`An error occurred: ${error.message}`);
    }
  };

  return { error, response, handleLogout };
};

export default useLogoutEffect;