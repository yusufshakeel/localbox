import {useState} from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Plus} from 'lucide-react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {userCreateSchema} from '@/validations/user-validation';
import {Form} from '@/components/ui/form';
import httpClient from '@/api-clients';
import showToast from '@/utils/show-toast';
import {AlertError} from '@/components/alerts';
import {getISOStringDate} from '@/utils/date';
import {PasswordInputField, TextInputField} from '@/components/form/input-field';

export default function CreateUser(props: any) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const form = useForm<z.infer<typeof userCreateSchema>>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      username: '',
      displayName: '',
      password: ''
    }
  });

  const closeDialog = () => {
    setErrorMessage('');
    setOpen(false);
  };

  async function onSubmit(values: z.infer<typeof userCreateSchema>) {
    try {
      setErrorMessage('');
      const response = await httpClient.post({
        url: '/api/admins/users',
        body: values
      });
      if (response.statusCode === 201) {
        props.setLastUserAccountChangesAt(getISOStringDate());
        closeDialog();
        showToast({ content: 'Account created', type: 'success', autoClose: 1000 });
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
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus />
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
        </DialogHeader>
        <div>
          { errorMessage && <AlertError message={errorMessage}/> }
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <TextInputField
                form={form}
                name="displayName"
                label="Display Name"
              />

              <TextInputField
                form={form}
                name="username"
                label="Username"
              />

              <PasswordInputField
                form={form}
                name='password'
                label='Password'
              />

              <Button type="submit" className="me-3">Create</Button>
              <Button type="reset" variant="secondary" className="me-3" onClick={closeDialog}>Close</Button>
            </form>
          </Form>
        </div>
        <div className="my-3 text-sm text-muted-foreground">
          <p>You need to set the permissions after creating the user account.</p>
          <p>By default, a user will have the least permissions.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}