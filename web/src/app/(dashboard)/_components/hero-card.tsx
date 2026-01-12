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
          className="group relative h-96 w-full cursor-pointer overflow-hidden border-0 bg-black shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <Image
            src={cover}
            alt={hero.nickname}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-90"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent transition-all duration-300 group-hover:via-black/40" />

        <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="absolute right-2 top-2 z-20 h-8 w-8 rounded-full bg-black/40 text-white hover:bg-red-600 hover:text-white hover:cursor-pointer backdrop-blur-md"
            disabled={deleting}
        >
          <Trash2 className="h-4 w-4 " />
        </Button>

        <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col justify-end p-5">
          <h3 className="text-2xl font-bold leading-tight text-white drop-shadow-md">
            {hero.nickname}
          </h3>
        </div>
      </Card>
  );
}