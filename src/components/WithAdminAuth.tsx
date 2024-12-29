import Cookies from 'js-cookie';
import {useEffect, useState} from 'react';
import useRouter from 'next/router';
import LoadingComponent from '@/components/LoadingComponent';
import httpClient from '@/api-clients';
import {AccountType} from '@/types/account-type';
import {AuthPayload} from '@/types/auth-payload';

export default function WithAdminAuth(WrappedComponent: any) {
  return function AuthProtected(props: any) {
    const [isLoading, setIsLoading] = useState(true);
    const [authAccountDetails, setAuthAccountDetails] = useState<AuthPayload>();

    useEffect(() => {
      const validateJWT = async () => {
        try {
          setIsLoading(true);
          const response: any = await httpClient.post<any>({
            url: `/api/auth/verify`,
            body: {},
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${Cookies.get('access_token') as string}`
            }
          });
          if(response.statusCode !== 200
            || (response.statusCode === 200 && response.data.accountType !== AccountType.admin)) {
            await useRouter.push('/profile');
          }
          setAuthAccountDetails({
            id: response.data.id,
            username: response.data.username,
            accountType: response.data.accountType,
            rbac: response.data.rbac
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: any) {
          await useRouter.push('/login');
        } finally {
          setIsLoading(false);
        }
      };
      validateJWT();
    }, []);

    if (isLoading) {
      return <LoadingComponent/>;
    }

    return <WrappedComponent {...props} authAccountDetails={authAccountDetails} />;
  };
}