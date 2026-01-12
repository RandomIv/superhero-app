'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Superhero, CreateSuperheroDto, UpdateSuperheroDto, SuperheroImage } from '@/types';
import { useUploadImage } from '@/hooks/useSuperheroes';
import { toast } from 'sonner';
import { getImageUrl } from '@/lib/utils';

const formSchema = z.object({
  nickname: z.string().min(1, 'Nickname is required'),
  realName: z.string().min(1, 'Real name is required'),
  originDescription: z.string().min(1, 'Origin description is required'),
  catchPhrase: z.string().min(1, 'Catch phrase is required'),
  superpowerInput: z.string().optional(),
  superpowers: z.array(z.string()),
  images: z.array(
      z.object({
        id: z.string(),
        imagePath: z.string(),
      })
  ),
});

export type HeroFormValues = z.infer<typeof formSchema>;

interface HeroFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  hero?: Superhero;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CreateSuperheroDto) => void | Promise<void>;
  onUpdate: (id: string, data: UpdateSuperheroDto) => void | Promise<void>;
}

const DROPZONE_TEXT = 'Drag & drop images here or click to upload';

export default function HeroForm({ open, mode, hero, onOpenChange, onCreate, onUpdate }: HeroFormProps) {
  const uploadImage = useUploadImage();
  const [isUploading, setIsUploading] = useState(false);

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
      [hero]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HeroFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const superpowers = watch('superpowers');
  const images = watch('images');
  const superpowerInput = watch('superpowerInput');

  const onSubmit = async (values: HeroFormValues) => {
    const payload: CreateSuperheroDto = {
      nickname: values.nickname,
      realName: values.realName,
      originDescription: values.originDescription,
      catchPhrase: values.catchPhrase,
      superpowers: values.superpowers,
      images: values.images.map((img) => img.id),
    };

    if (mode === 'edit' && hero) {
      await onUpdate(hero.id, payload);
    } else {
      await onCreate(payload);
    }
  };

  const addPower = () => {
    if (!superpowerInput) return;
    setValue('superpowers', [...superpowers, superpowerInput]);
    setValue('superpowerInput', '');
  };

  const removePower = (power: string) => {
    setValue(
        'superpowers',
        superpowers.filter((p) => p !== power)
    );
  };

  const onDrop = async (files: FileList | null) => {
    if (!files?.length) return;
    setIsUploading(true);
    try {
      const uploads = await Promise.all(
          Array.from(files).map(async (file) => {
            const res = await uploadImage.mutateAsync(file);
            return res as SuperheroImage;
          })
      );
      setValue('images', [...images, ...uploads]);
      toast.success('Images uploaded');
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (idToRemove: string) => {
    setValue('images', images.filter(img => img.id !== idToRemove));
  }

  const hasImages = images.length > 0;

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden p-0">
          <DialogHeader className="border-b p-6">
            <DialogTitle className="text-2xl font-semibold">
              {mode === 'create' ? 'Create Superhero' : 'Edit Superhero'}
            </DialogTitle>
            <DialogDescription>Fill out the hero details below.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="flex max-h-[70vh] flex-col">
            <div className="space-y-6 overflow-y-auto p-6">
              <div
                  className="rounded-lg border border-dashed bg-muted/60 p-6 text-center transition hover:border-primary"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    onDrop(e.dataTransfer.files);
                  }}
              >
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="hero-images-input"
                    onChange={(e) => onDrop(e.target.files)}
                />
                <label htmlFor="hero-images-input" className="flex cursor-pointer flex-col items-center gap-2">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{DROPZONE_TEXT}</p>
                  {isUploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
                </label>

                {hasImages && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {images.map((img) => (
                          <div key={img.id} className="relative aspect-video group overflow-hidden rounded-md border bg-background">
                            <img
                                src={getImageUrl(img.imagePath)}
                                alt="Uploaded"
                                className="h-full w-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(img.id)}
                                className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                      ))}
                    </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nickname</label>
                  <Input placeholder="e.g. Thunderstrike" {...register('nickname')} />
                  {errors.nickname && <p className="text-xs text-destructive">{errors.nickname.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Real Name</label>
                  <Input placeholder="e.g. Jane Doe" {...register('realName')} />
                  {errors.realName && <p className="text-xs text-destructive">{errors.realName.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Catch Phrase</label>
                <Input placeholder="e.g. To the skies!" {...register('catchPhrase')} />
                {errors.catchPhrase && <p className="text-xs text-destructive">{errors.catchPhrase.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Origin Description</label>
                <Textarea rows={4} placeholder="Describe the origin story" {...register('originDescription')} />
                {errors.originDescription && (
                    <p className="text-xs text-destructive">{errors.originDescription.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Superpowers</label>
                <Input
                    placeholder="Type a superpower and press Enter"
                    value={superpowerInput || ''}
                    onChange={(e) => setValue('superpowerInput', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addPower();
                      }
                    }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {superpowers.map((power) => (
                      <Badge key={power} variant="secondary" className="gap-1">
                        {power}
                        <button
                            type="button"
                            onClick={() => removePower(power)}
                            className="rounded-full p-1 hover:bg-muted"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="border-t bg-card p-6">
              <div className="flex w-full justify-between gap-3">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || isUploading}>
                  {mode === 'create' ? 'Save' : 'Update'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
}