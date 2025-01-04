import {useState} from 'react';
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
import {signIn} from 'next-auth/react';
import {TriangleIcon} from 'lucide-react';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType
} from 'next';
import { getCsrfToken } from 'next-auth/react';

export const loginFormSchema = z.object({
  username: z.string({ required_error: 'Username is required' })
    .min(1, 'Username is required'),
  password: z.string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
});

export default function LogInPage({
  csrfToken
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [globalError, setGlobalError] = useState<string>('');
  
  // 1. Define the form.
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const {username, password} = values;
    try {
      await signIn('credentials', { username, password, redirectTo: '/' });
    } catch (error: any) {
      switch (error.type) {
      case 'CredentialsSignin':
        setGlobalError('Invalid credentials');
        break;
      default:
        setGlobalError('Something went wrong');
      }
    }
  }

  return (
    <BaseLayout pageTitle={'Log In'}>
      <div className="flex w-full items-center justify-center p-5">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Log In</CardTitle>
            </CardHeader>
            <CardContent>
              {
                globalError && (
                  <div
                    className="flex w-full items-center p-4 mb-4 gap-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                    role="alert"
                  >
                    <TriangleIcon className="h-4 w-4 text-red-500"/>
                    <span className="sr-only">Error</span>
                    <div>{globalError}</div>
                  </div>
                )
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