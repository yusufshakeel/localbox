import Cookies from 'js-cookie';
import {useEffect, useState} from 'react';
import useRouter from 'next/router';
import LoadingComponent from '@/components/LoadingComponent';
import httpClient from '@/api-clients';
import {AuthPayload} from '@/types/auth-payload';

export default function WithAuth(WrappedComponent: any, pageId?: string) {
  return function AuthProtected(props: any) {
    const [isLoading, setIsLoading] = useState(true);
    const [authAccountDetails, setAuthAccountDetails] = useState<AuthPayload>();

    useEffect(() => {
      const validateJWT = async () => {
        try {
          setIsLoading(true);

          if (pageId) {
            const pagePermissionsApiResponse = await httpClient.get<any>({
              url: `/api/rbac/page-permissions`,
              params: {pageId},
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${Cookies.get('access_token') as string}`
              }
            });
            if(!pagePermissionsApiResponse.data?.hasPermissions) {
              await useRouter.push('/profile');
            }
          }

          const verifyApiResponse = await httpClient.post<any>({
            url: `/api/auth/verify`,
            body: {},
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${Cookies.get('access_token') as string}`
            }
          });
          if(verifyApiResponse.statusCode !== 200) {
            await useRouter.push('/login');
          }

          setAuthAccountDetails({
            id: verifyApiResponse.data.id,
            username: verifyApiResponse.data.username,
            accountType: verifyApiResponse.data.accountType,
            rbac: verifyApiResponse.data.rbac
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