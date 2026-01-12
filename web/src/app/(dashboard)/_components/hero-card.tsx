'use client';

import Image from 'next/image';
import { MouseEvent } from 'react';
import { Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Superhero } from '@/types';
import { getImageUrl } from '@/lib/utils';

interface HeroCardProps {
  hero: Superhero;
  onSelect: () => void;
  onDelete: () => void;
  deleting?: boolean;
}

export default function HeroCard({ hero, onSelect, onDelete, deleting }: HeroCardProps) {
  const cover = getImageUrl(hero.images?.[0]?.imagePath);

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
      <Card
          onClick={onSelect}
          className="group relative cursor-pointer overflow-hidden border bg-card transition hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="relative w-full overflow-hidden">
          <div className="relative aspect-video w-full bg-muted">
            <Image
                src={cover}
                alt={hero.nickname}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
            />
          </div>
          <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="absolute right-2 top-2 z-10 rounded-full bg-background/80 text-destructive shadow-sm hover:bg-background"
              disabled={deleting}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>

        <div className="space-y-1 p-4">
          <h3 className="text-lg font-semibold leading-tight">{hero.nickname}</h3>
          <p className="text-sm text-muted-foreground">{hero.realName}</p>
          <p className="line-clamp-2 text-sm text-muted-foreground">{hero.catchPhrase}</p>
        </div>
      </Card>
  );
}