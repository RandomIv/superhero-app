import { Control } from 'react-hook-form';
import { X } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { HeroFormValues } from '@/schemas/hero-form-schema';

interface HeroSuperpowersProps {
  control: Control<HeroFormValues>;
}

export function HeroSuperpowers({ control }: HeroSuperpowersProps) {
  return (
    <FormField
      control={control}
      name="superpowers"
      render={({ field }) => {
        const powers: string[] = field.value || [];
        return (
          <FormItem>
            <FormLabel>Superpowers</FormLabel>
            <FormField
              control={control}
              name="superpowerInput"
              render={({ field: inputField }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Type a superpower and press Enter"
                      {...inputField}
                      value={inputField.value || ''}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = inputField.value?.trim();
                          if (val && !powers.includes(val)) {
                            field.onChange([...powers, val]);
                            inputField.onChange('');
                          }
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {powers.map((power) => (
                <Badge key={power} variant="secondary" className="gap-1">
                  {power}
                  <button
                    type="button"
                    onClick={() =>
                      field.onChange(powers.filter((p) => p !== power))
                    }
                    className="rounded-full p-1 hover:bg-muted focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {!powers.length && (
                <p className="text-xs text-muted-foreground">
                  No powers added yet.
                </p>
              )}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
