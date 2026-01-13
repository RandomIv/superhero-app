import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { HeroFormValues } from '@/schemas/hero-form-schema';

interface HeroTextFieldProps {
  control: Control<HeroFormValues>;
  name: keyof HeroFormValues;
  label: string;
  placeholder?: string;
}

export function HeroTextField({
  control,
  name,
  label,
  placeholder,
}: HeroTextFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              value={field.value?.toString() || ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
