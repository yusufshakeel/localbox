import Cookies from 'js-cookie';
import {useEffect, useState} from 'react';
import useRouter from 'next/router';
import LoadingComponent from '@/components/LoadingComponent';
import httpClient from '@/api-clients';

export default function WithAdminAuth(WrappedComponent: any) {
  return function AuthProtected(props: any) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const validateJWT = async () => {
        try {
          setIsLoading(true);
          const response = await httpClient.post<any>({
            url: `/api/auth/verify`,
            body: { accessToken: Cookies.get('access_token') as string },
            headers: {'Content-Type': 'application/json'}
          });
          if(response.statusCode === 200 && response.data.isValid) {
            await useRouter.push('/admins');
          } else {
            await useRouter.push('/admins/login');
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: any) {
          await useRouter.push('/admins/login');
        } finally {
          setIsLoading(false);
        }
      };
      validateJWT();
    }, []);

    if (isLoading) {
      return <LoadingComponent/>;
    }

    return <WrappedComponent {...props} />;
  };
}