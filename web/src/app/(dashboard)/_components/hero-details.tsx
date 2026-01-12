'use client';

import Image from 'next/image';
import { BadgeCheck, Pencil, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Superhero } from '@/types';
import { getImageUrl } from '@/lib/utils';

interface HeroDetailsProps {
  hero: Superhero | null;
  open: boolean;
  onClose: () => void;
  onEdit: (hero: Superhero) => void;
  onDelete: (id: string) => void;
}

export default function HeroDetails({ hero, open, onClose, onEdit, onDelete }: HeroDetailsProps) {
  const images = hero?.images?.length ? hero.images : [];

  return (
      <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <SheetContent side="right" className="w-full max-w-xl p-0">
          <SheetHeader className="border-b p-4">
            <SheetTitle className="text-2xl font-bold leading-tight">{hero?.nickname}</SheetTitle>
            <p className="text-sm text-muted-foreground">{hero?.realName}</p>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-6 p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {images.map((img) => (
                    <div key={img.id} className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                      <Image
                          src={getImageUrl(img.imagePath)}
                          alt={hero?.nickname || 'Superhero image'}
                          fill
                          className="object-cover"
                          unoptimized
                      />
                    </div>
                ))}
                {!images.length && (
                    <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted flex items-center justify-center text-muted-foreground">
                      No images
                    </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold uppercase text-muted-foreground">Catch phrase</h4>
                <p className="rounded-lg bg-muted p-3 text-sm italic">{hero?.catchPhrase}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold uppercase text-muted-foreground">Origin</h4>
                <p className="text-sm text-foreground">{hero?.originDescription}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase text-muted-foreground">Superpowers</h4>
                <div className="flex flex-wrap gap-2">
                  {(hero?.superpowers || []).map((power) => (
                      <Badge key={power} variant="secondary" className="gap-1">
                        <BadgeCheck className="h-3 w-3" />
                        {power}
                      </Badge>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          {hero && (
              <SheetFooter className="border-t p-4">
                <div className="flex w-full items-center justify-between gap-3">
                  <Button variant="destructive" size="sm" onClick={() => onDelete(hero.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                  <Button size="sm" onClick={() => onEdit(hero)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit Superhero
                  </Button>
                </div>
              </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
  );
}