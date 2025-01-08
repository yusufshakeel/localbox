import {useEffect, useState} from 'react';
import {
  Dialog,
  DialogContent, DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import httpClient from '@/api-clients';
import showToast from '@/utils/show-toast';
import {AlertError} from '@/components/alerts';
import {UserType} from '@/types/users';
import {getISOStringDate} from '@/utils/date';
import {userUpdatePermissionsSchema} from '@/validations/user-validation';

export default function UpdateUserPermissions(props: any) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userAccountDetails, setUserAccountDetails] = useState<any>(null);
  const [pages, setPages] = useState([]);

  const form = useForm<z.infer<typeof userUpdatePermissionsSchema>>({
    resolver: zodResolver(userUpdatePermissionsSchema),
    defaultValues: {
      permissions: []
    }
  });

  useEffect(() => {
    if (props.userAccountPermissionsToUpdate?.id) {
      (async () => {
        try {
          const response: any = await httpClient.get({
            url: '/api/admins/pages',
            params: {
              pageFor: [UserType.any, UserType.user].join(',')
            }
          });
          if (response.statusCode === 200) {
            setPages(response.data.pages);
            setUserAccountDetails(props.userAccountPermissionsToUpdate);

            form.setValue('permissions', props.userAccountPermissionsToUpdate.permissions);

            setOpen(true);
          } else {
            setErrorMessage(response.message!);
          }
        } catch (error: any) {
          showToast({ content: error.message, type: 'error' });
        }
      })();
    }
  }, [form, props.userAccountPermissionsToUpdate]);

  async function onSubmit(data: z.infer<typeof userUpdatePermissionsSchema>) {
    try {
      setErrorMessage('');
      const response = await httpClient.patch({
        url: '/api/admins/users',
        body: { permissions: data.permissions },
        params: { userId: props.userAccountPermissionsToUpdate.id, updateFor: 'permissions' }
      });
      if (response.statusCode === 200) {
        setUserAccountDetails(null);
        props.setLastUserAccountChangesAt(getISOStringDate());
        setOpen(false);
        props.setUserAccountPermissionsToUpdate('');
        showToast({
          content: 'User account permissions updated successfully',
          type: 'success',
          autoClose: 1000
        });
        form.reset();
      } else {
        setErrorMessage(response.message!);
      }
    } catch (error: any) {
      showToast({ content: error.message, type: 'error' });
    }
  }

  if (!userAccountDetails) {
    return;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Update Permissions</DialogTitle>
          <DialogDescription>Username: {userAccountDetails.username}</DialogDescription>
        </DialogHeader>
        <div>
          { errorMessage && <AlertError message={errorMessage}/> }
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="max-h-[300px] p-3 overflow-y-auto">
                <FormField
                  control={form.control}
                  name="permissions"
                  render={() => (
                    <FormItem>
                      {
                        pages.map((page: any) => {
                          const permissions = page.permissions.map((permission: any) => {
                            return (
                              <FormField
                                key={permission}
                                control={form.control}
                                name="permissions"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={permission}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(permission)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, permission])
                                              : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== permission
                                                )
                                              );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        {permission}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            );
                          });

                          return (
                            <div key={page.id}>
                              <h1>Page: {page.title}</h1>
                              {permissions}
                            </div>
                          );
                        })
                      }
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}