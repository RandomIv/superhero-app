'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CreateSuperheroDto, UpdateSuperheroDto } from '@/types';
import { formSchema, HeroFormValues } from '@/schemas/hero-form-schema';
import { HeroTextField } from './hero-text-field';
import { HeroImageUpload } from './hero-image-upload';
import { HeroSuperpowers } from './hero-superpowers';
import { useSuperhero } from '@/hooks/useSuperheroes';

interface HeroFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  heroId?: string | null;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CreateSuperheroDto) => void | Promise<void>;
  onUpdate: (id: string, data: UpdateSuperheroDto) => void | Promise<void>;
}

export default function HeroForm({
  open,
  mode,
  heroId,
  onOpenChange,
  onCreate,
  onUpdate,
}: HeroFormProps) {
  const { data: hero, isLoading } = useSuperhero(
    mode === 'edit' && heroId ? heroId : null,
  );

  const defaultValues: HeroFormValues = useMemo(
    () => ({
      nickname: hero?.nickname || '',
      realName: hero?.realName || '',
      originDescription: hero?.originDescription || '',
      catchPhrase: hero?.catchPhrase || '',
      superpowerInput: '',
      superpowers: hero?.superpowers || [],
      images: hero?.images || [],
    }),
    [hero],
  );

  const form = useForm<HeroFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleSubmitForm = async (values: HeroFormValues) => {
    const payload: CreateSuperheroDto = {
      nickname: values.nickname,
      realName: values.realName,
      originDescription: values.originDescription,
      catchPhrase: values.catchPhrase,
      superpowers: values.superpowers,
      images: values.images.map((img) => img.id),
    };

    if (mode === 'edit' && heroId) {
      await onUpdate(heroId, payload);
    } else {
      await onCreate(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b p-6">
          <DialogTitle className="text-2xl font-semibold">
            {mode === 'create' ? 'Create Superhero' : 'Edit Superhero'}
          </DialogTitle>
          <DialogDescription>
            Fill out the hero details below.
          </DialogDescription>
        </DialogHeader>

        {isLoading && mode === 'edit' ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitForm)}
              className="flex max-h-[70vh] flex-col"
            >
              <div className="space-y-6 overflow-y-auto p-6">
                <HeroImageUpload control={form.control} />

                <div className="grid gap-4 md:grid-cols-2">
                  <HeroTextField
                    control={form.control}
                    name="nickname"
                    label="Nickname"
                    placeholder="e.g. Thunderstrike"
                  />
                  <HeroTextField
                    control={form.control}
                    name="realName"
                    label="Real Name"
                    placeholder="e.g. Jane Doe"
                  />
                </div>

                <HeroTextField
                  control={form.control}
                  name="catchPhrase"
                  label="Catch Phrase"
                  placeholder="e.g. To the skies!"
                />

                <FormField
                  control={form.control}
                  name="originDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Describe the origin story"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <HeroSuperpowers control={form.control} />
              </div>

              <DialogFooter className="border-t bg-card p-6">
                <div className="flex w-full justify-between gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      form.formState.isSubmitting ||
                      (isLoading && mode === 'edit')
                    }
                  >
                    {mode === 'create' ? 'Save' : 'Update'}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
