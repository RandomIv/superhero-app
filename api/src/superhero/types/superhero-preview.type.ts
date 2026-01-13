import { Prisma } from '../../generated/prisma/client';
export const superheroPreviewSelect = {
  id: true,
  nickname: true,
  images: {
    orderBy: { createdAt: 'desc' },
    take: 1,
  },
} satisfies Prisma.SuperheroSelect;

export type SuperheroPreview = Prisma.SuperheroGetPayload<{
  select: typeof superheroPreviewSelect;
}>;
