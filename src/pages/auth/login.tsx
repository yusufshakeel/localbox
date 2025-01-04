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
import {
  AUTH_PASSWORD_MAX_LENGTH,
  AUTH_PASSWORD_MIN_LENGTH,
  AUTH_USERNAME_MAX_LENGTH, AUTH_USERNAME_MIN_LENGTH
} from '@/configs/auth';

export const loginFormSchema = z.object({
  username: z.string({ required_error: 'Username is required' })
    .min(1, 'Username is required')
    .min(AUTH_USERNAME_MIN_LENGTH, `Username cannot be less than ${AUTH_USERNAME_MIN_LENGTH} characters`)
    .max(AUTH_USERNAME_MAX_LENGTH, `Username cannot be more than ${AUTH_USERNAME_MAX_LENGTH} characters`),
  password: z.string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(AUTH_PASSWORD_MIN_LENGTH, `Password must be less than ${AUTH_PASSWORD_MIN_LENGTH} characters`)
    .max(AUTH_PASSWORD_MAX_LENGTH, `Password must be more than ${AUTH_PASSWORD_MAX_LENGTH} characters`)
});

export default function LogInPage() {
  // 1. Define the form.
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // eslint-disable-next-line
    console.log(values);
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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