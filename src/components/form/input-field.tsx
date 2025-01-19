import {useState} from 'react';
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Eye, EyeOff} from 'lucide-react';
import {UseFormReturn} from 'react-hook-form';

type FieldProps = {
  form: UseFormReturn<any>
  name: string
  label?: string
}

const TextInputField = ({ form, label, name }: FieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({field}) => (
        <FormItem>
          { label && <FormLabel>{label}</FormLabel> }
          <FormControl>
            <Input type="text" autoComplete="off" {...field}/>
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
    />
  );
};

const PasswordInputField = ({ form, label, name }: FieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({field}) => (
        <FormItem>
          { label && <FormLabel>{label}</FormLabel> }
          <FormControl>
            <div className="relative">
              <Input type={showPassword ? 'text' : 'password'} autoComplete="off" {...field}/>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
          </FormControl>
          <FormMessage/>
        </FormItem>
      )}
    />
  );
};

export { PasswordInputField, TextInputField };