import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ComponentType, useEffect } from 'react';
import LoadingSpinner from '@/components/loading';
import BaseLayout from '@/layouts/BaseLayout';

interface WithAuthOptions {
  redirectTo?: string; // Redirect for unauthenticated users
  requireAuthentication?: boolean; // Whether authentication is required
}

export function WithAuth(
  WrappedComponent: ComponentType,
  options: WithAuthOptions = { redirectTo: '/auth/login', requireAuthentication: true }
): ComponentType {
  return function AuthPage(props) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { redirectTo = '/', requireAuthentication = true } = options;

    useEffect(() => {
      (async () => {
        if (status === 'authenticated' && !requireAuthentication) {
          // Redirect logged-in users if they are not allowed on this page
          await router.push(redirectTo);
        } else if (status === 'unauthenticated' && requireAuthentication) {
          // Redirect unauthenticated users to the login page
          await router.push('/auth/login');
        }
      })();
    }, [status, router, redirectTo, requireAuthentication]);

    if (status === 'loading') {
      // Optionally display a loading state while session is checked
      return <LoadingSpinner/>;
    }

    if (!session) {
      return (
        <BaseLayout pageTitle={'Profile'}>
          <div className="grid gap-4">
            <p>You are logged out!</p>
          </div>
        </BaseLayout>
      );
    }

    // Render the wrapped component if the conditions are met
    return <WrappedComponent {...props} />;
  };
}
