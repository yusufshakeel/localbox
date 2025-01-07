import {useEffect, useState} from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {userUpdatePasswordSchema} from '@/validations/user-validation';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import httpClient from '@/api-clients';
import showToast from '@/utils/show-toast';
import {AlertError} from '@/components/alerts';
import {getISOStringDate} from '@/utils/date';

export default function UpdateUserPassword(props: any) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const form = useForm<z.infer<typeof userUpdatePasswordSchema>>({
    resolver: zodResolver(userUpdatePasswordSchema),
    defaultValues: {
      password: ''
    }
  });

  useEffect(() => {
    if (props.userAccountPasswordToUpdate?.id) {
      setOpen(true);
    }
  }, [props.userAccountPasswordToUpdate]);

  async function onSubmit(values: z.infer<typeof userUpdatePasswordSchema>) {
    try {
      setErrorMessage('');
      const response = await httpClient.patch({
        url: '/api/admins/users',
        body: values,
        params: { userId: props.userAccountPasswordToUpdate.id, updateFor: 'password' }
      });
      if (response.statusCode === 200) {
        props.setLastUserAccountChangesAt(getISOStringDate());
        setOpen(false);
        props.setUserAccountPasswordToUpdate('');
        showToast({ content: 'Password updated successfully', type: 'success', autoClose: 1000 });
        form.reset();
      } else {
        setErrorMessage(response.message!);
      }
    } catch (error: any) {
      showToast({ content: error.message, type: 'error' });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Update Password</DialogTitle>
        </DialogHeader>
        <div>
          { errorMessage && <AlertError message={errorMessage}/> }
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="text"
                        autoComplete="off"
                        {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <Button type="submit" className="me-3">Update</Button>
              <Button type="reset" variant="secondary" className="me-3"
                onClick={() => setOpen(false)}>Close</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}