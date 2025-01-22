import {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {AlertError} from '@/components/alerts';
import {Form} from '@/components/ui/form';
import {TextInputField} from '@/components/form/input-field';
import {Button} from '@/components/ui/button';
import {useForm} from 'react-hook-form';
import showToast from '@/utils/show-toast';
import httpClient from '@/api-clients';
import {getISOStringDate} from '@/utils/date';

export default function UpdateConfig(props: any) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const form = useForm({
    defaultValues: {
      value: ''
    }
  });

  useEffect(() => {
    if (props.configToUpdate?.id) {
      form.setValue('value', props.configToUpdate.value);
      setOpen(true);
    }
  }, [form, props.configToUpdate]);

  const closeDialog = () => {
    setErrorMessage('');
    setOpen(false);
  };

  async function onSubmit({ value }: any) {
    try {
      setErrorMessage('');
      const response = await httpClient.patch({
        url: '/api/admins/configs',
        body: {
          id: props.configToUpdate.id,
          value
        }
      });
      if (response.statusCode === 200) {
        closeDialog();
        props.setLastConfigChangesAt(getISOStringDate());
        props.setConfigToUpdate(null);
        showToast({ content: 'Value updated successfully', type: 'success', autoClose: 1000 });
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
          <DialogTitle>Update Config</DialogTitle>
        </DialogHeader>
        <div>
          { errorMessage && <AlertError message={errorMessage}/> }
          <div className="mb-5">
            <p>Current</p>
            <p>Key: {props.configToUpdate?.key}</p>
            <p>Value: {props.configToUpdate?.value}</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <TextInputField
                form={form}
                name='value'
                label='Update Value'
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