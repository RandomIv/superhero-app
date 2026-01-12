import { z } from 'zod';

export const imageSchema = z.object({
  id: z.string(),
  imagePath: z.string(),
  superheroId: z.string().optional().nullable(),
});

export const formSchema = z.object({
  nickname: z.string().min(1, 'Nickname is required'),
  realName: z.string().min(1, 'Real name is required'),
  originDescription: z.string().min(1, 'Origin description is required'),
  catchPhrase: z.string().min(1, 'Catch phrase is required'),
  superpowerInput: z.string(),
  superpowers: z.array(z.string()),
  images: z.array(imageSchema),
});

export type HeroFormValues = z.infer<typeof formSchema>;

