import {useEffect, useState} from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {userUpdateSchema} from '@/validations/user-validation';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import httpClient from '@/api-clients';
import showToast from '@/utils/show-toast';
import {AlertError} from '@/components/alerts';
import {getISOStringDate} from '@/utils/date';
import {UserStatus} from '@/types/users';
import {TextInputField} from '@/components/form/input-field';
import {Pages} from '@/configs/pages';
import {PermissionsType} from '@/types/permissions';

export default function UpdateUser(props: any) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showPersonalDriveStorageLimit, setShowPersonalDriveStorageLimit] = useState(false);

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
      form.setValue('status', props.userAccountToUpdate.status);

      if (props.userAccountToUpdate.permissions.includes(`${Pages.personalDrive.id}:${PermissionsType.AUTHORIZED_USE}`)) {
        form.setValue('personalDriveStorageLimit', props.userAccountToUpdate?.personalDriveStorageLimit?.toString() || '0');
        setShowPersonalDriveStorageLimit(true);
      } else {
        setShowPersonalDriveStorageLimit(false);
      }

      setOpen(true);
    }
  }, [form, props.userAccountToUpdate]);

  const closeDialog = () => {
    setErrorMessage('');
    setOpen(false);
  };

  async function onSubmit(values: z.infer<typeof userUpdateSchema>) {
    try {
      setErrorMessage('');

      if (props.userAccountToUpdate.permissions.includes(`${Pages.personalDrive.id}:${PermissionsType.AUTHORIZED_USE}`)) {
        const {personalDriveStorageLimit} = values;

        if (!personalDriveStorageLimit) {
          setErrorMessage('Personal Drive storage limit is required.');
          return;
        }

        if (+personalDriveStorageLimit < 0) {
          setErrorMessage('Personal Drive storage limit cannot be less than 0.');
          return;
        }

        if (+personalDriveStorageLimit < +props.userAccountToUpdate.personalDriveStorageUsed) {
          setErrorMessage(
            `Personal Drive storage limit cannot be less than ${+props.userAccountToUpdate.personalDriveStorageUsed}.`
          );
          return;
        }
      }

      const response = await httpClient.patch({
        url: '/api/admins/users',
        body: values,
        params: { userId: props.userAccountToUpdate.id, updateFor: 'accountDetails' }
      });
      if (response.statusCode === 200) {
        props.setLastUserAccountChangesAt(getISOStringDate());
        closeDialog();
        props.setUserAccountToUpdate('');
        showToast({ content: 'Details updated successfully', type: 'success', autoClose: 1000 });
        form.reset();
      } else {
        setErrorMessage(response.message!);
      }
    } catch (error: any) {
      showToast({ content: error.message, type: 'error' });
    }
  }

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Update Details</DialogTitle>
        </DialogHeader>
        <div>
          { errorMessage && <AlertError message={errorMessage}/> }
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <TextInputField
                form={form}
                name="displayName"
                label="Update display name"
              />

              <TextInputField
                form={form}
                name="username"
                label="Update username"
              />

              {
                showPersonalDriveStorageLimit
                && (
                  <>
                    <TextInputField
                      form={form}
                      name="personalDriveStorageLimit"
                      label="Personal Drive - Update storage limit (in Bytes)"
                    />
                    <p className="text-sm">
                      Used: {props.userAccountToUpdate?.personalDriveStorageUsed || 0} Bytes
                      <br/>
                      Limit: {props.userAccountToUpdate?.personalDriveStorageLimit} Bytes
                    </p>
                  </>
                )
              }

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Update account status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Account status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserStatus.active}>{UserStatus.active}</SelectItem>
                        <SelectItem value={UserStatus.suspend}>{UserStatus.suspend}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="me-3">Update</Button>
              <Button type="reset" variant="secondary" className="me-3" onClick={closeDialog}>Close</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}