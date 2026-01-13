import { useState } from 'react';
import { Control } from 'react-hook-form';
import Image from 'next/image';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { HeroFormValues } from '@/schemas/hero-form-schema';
import { SuperheroImage } from '@/types';
import { useUploadImage } from '@/hooks/useSuperheroes';
import { getImageUrl } from '@/lib/utils';

interface HeroImageUploadProps {
  control: Control<HeroFormValues>;
}

export function HeroImageUpload({ control }: HeroImageUploadProps) {
  const uploadImage = useUploadImage();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (
    files: FileList | null,
    onChange: (value: SuperheroImage[]) => void,
    currentImages: SuperheroImage[],
  ) => {
    if (!files?.length) return;

    setIsUploading(true);

    try {
      const uploads = await Promise.all(
        Array.from(files).map(
          (file) => uploadImage.mutateAsync(file) as Promise<SuperheroImage>,
        ),
      );

      onChange([...currentImages, ...uploads]);
      toast.success('Images uploaded');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormField
      control={control}
      name="images"
      render={({ field }) => {
        const images = field.value || [];

        return (
          <FormItem>
            <FormLabel>Images</FormLabel>
            <FormControl>
              <div
                className="rounded-lg border border-dashed bg-muted/60 p-6 text-center transition hover:border-primary"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleUpload(e.dataTransfer.files, field.onChange, images);
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="hero-images-input"
                  onChange={(e) =>
                    handleUpload(e.target.files, field.onChange, images)
                  }
                  disabled={isUploading}
                />

                <label
                  htmlFor="hero-images-input"
                  className="flex cursor-pointer flex-col items-center gap-2"
                >
                  <Plus className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop images here or click to upload
                  </p>
                  {isUploading && (
                    <p className="text-xs text-primary animate-pulse">
                      Uploading...
                    </p>
                  )}
                </label>

                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.map((img) => (
                      <div
                        key={img.id}
                        className="relative aspect-video group overflow-hidden rounded-md border bg-background"
                      >
                        <Image
                          src={getImageUrl(img.imagePath)}
                          alt="Uploaded"
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover"
                          unoptimized
                        />

                        <button
                          type="button"
                          onClick={() =>
                            field.onChange(
                              images.filter((i) => i.id !== img.id),
                            )
                          }
                          className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
