import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import {ComponentType, useEffect} from 'react';
import LoadingSpinner from '@/components/loading';
import {UserType} from '@/types/users';
import {PermissionsType} from '@/types/permissions';

interface WithAuthOptions {
  pageId: string;
  redirectTo?: string; // Redirect for unauthenticated users
  userType?: UserType; // Whether this page is for anyone of specific user type
  permissions?: PermissionsType[]; // List of permissions required for the page
}

export function WithAuth(
  WrappedComponent: ComponentType,
  options: WithAuthOptions
): ComponentType {
  return function AuthPage(props) {
    const { data: session, status } = useSession() as any;
    const router = useRouter();
    const { pageId, redirectTo = '/', userType = UserType.any, permissions = [] } = options;

    /**
     * Redirect rules to be applied in the following order
     *
     * Rule 1:
     *   If user is NOT_LOGGED_IN
     *   Then redirect to login page
     *
     * Rule 2:
     *   If user is LOGGED_IN
     *
     *   Rule 2.1:
     *     If protected page's USER_TYPE is ANY
     *       and logged-in user type IS_NOT_ADMIN
     *       and protected page REQUIRES some PERMISSIONS
     *       and logged-in user DOES_NOT_HAVE_REQUIRED_PERMISSIONS
     *     Then redirect
     *
     *   Rule 2.2:
     *     If protected page's USER_TYPE is ADMIN
     *       and logged-in user type IS_NOT_ADMIN
     *     Then redirect
     */
    useEffect(() => {
      (async () => {
        const hasPermissions = (userPermissions: string[]) => {
          return permissions.some(permission => userPermissions.includes(`${pageId}:${permission}`));
        };

        const isNonAdminUser = (loggedInUserType: UserType) => {
          return loggedInUserType !== UserType.admin;
        };

        // Rule 1
        if (status === 'unauthenticated') {
          await router.push('/auth/login');
        }

        // Rule 2
        else if (status === 'authenticated') {

          // Rule 2.1
          if (userType === UserType.any
            && isNonAdminUser(session.user.type)
            && permissions.length
            && !hasPermissions(session.user.permissions)
          ) {
            await router.push(redirectTo);
          }

          // Rule 2.2
          else if (userType === UserType.admin
            && isNonAdminUser(session.user.type)
          ) {
            await router.push(redirectTo);
          }
        }
      })();
    }, [status, router, redirectTo, userType, permissions, session, pageId]);

    if (!session) {
      // Display a loading state while session is checked
      return <LoadingSpinner/>;
    }

    // Render the wrapped component if the conditions are met
    return <WrappedComponent {...props} />;
  };
}
