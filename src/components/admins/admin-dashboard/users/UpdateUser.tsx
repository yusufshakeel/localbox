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
import {userUpdateSchema} from '@/validations/user-validation';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import httpClient from '@/api-clients';
import showToast from '@/utils/show-toast';
import {AlertError} from '@/components/alerts';
import {getISOStringDate} from '@/utils/date';

export default function UpdateUser(props: any) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const form = useForm<z.infer<typeof userUpdateSchema>>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      username: '',
      displayName: ''
    }
  });

  useEffect(() => {
    if (props.userAccountToUpdate?.id) {
      form.setValue('username', props.userAccountToUpdate.username);
      form.setValue('displayName', props.userAccountToUpdate.displayName);
      setOpen(true);
    }
  }, [form, props.userAccountToUpdate]);

  async function onSubmit(values: z.infer<typeof userUpdateSchema>) {
    try {
      setErrorMessage('');
      const response = await httpClient.patch({
        url: '/api/admins/users',
        body: values,
        params: { userId: props.userAccountToUpdate.id, updateFor: 'accountDetails' }
      });
      if (response.statusCode === 200) {
        props.setLastUserAccountChangesAt(getISOStringDate());
        setOpen(false);
        props.setUserAccountToUpdate('');
        showToast({ content: 'User account updated successfully', type: 'success', autoClose: 1000 });
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
          <DialogTitle>Update details</DialogTitle>
        </DialogHeader>
        <div>
          { errorMessage && <AlertError message={errorMessage}/> }
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="displayName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Update display name</FormLabel>
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
                name="username"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Update username</FormLabel>
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
              <Button type="reset" variant="secondary" className="me-3" onClick={() => setOpen(false)}>Close</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}