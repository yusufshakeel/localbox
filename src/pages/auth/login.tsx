import {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import BaseLayout from '@/layouts/BaseLayout';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType
} from 'next';
import {getCsrfToken, useSession} from 'next-auth/react';
import {AlertError} from '@/components/alerts';
import {handleCredentialsSignIn} from '@/services/auth-service';
import LoadingSpinner from '@/components/loading';
import {loginSchema} from '@/validations/login-validation';

export default function LogInPage({
  csrfToken
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { error } = router.query;

  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (status === 'authenticated') {
        await router.push('/'); // Redirect to home if logged in
      }
    })();
  }, [status, router]);

  useEffect(() => {
    if (typeof error === 'string') {
      if (error === 'CredentialsSignin') {
        setGlobalError('Invalid Credentials');
      } else {
        setGlobalError('Something went wrong');
      }
    }
  }, [error]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      await handleCredentialsSignIn(values);
    } catch (error: any) {
      setGlobalError(error.message);
    }
  }

  if (status === 'loading' || session) {
    return <LoadingSpinner/>;
  }

  return (
    <BaseLayout pageTitle={'Log In'}>
      <div className="flex w-full items-center justify-center p-5">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Log in to your account</CardTitle>
            </CardHeader>
            <CardContent>
              {
                globalError && <AlertError message={globalError}/>
              }
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <input name="csrfToken" type="hidden" defaultValue={csrfToken}/>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input type="text"
                            autoComplete="off"
                            {...field}/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password"
                            {...field}/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Log In</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="my-10 text-center">
            <p>Don&apos;t have any account?</p>
            <p>Contact the admin for account creation.</p>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context)
    }
  };
}