'use client';

import Image from 'next/image';
import { Pencil, Trash2, Zap, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/utils';
import { useSuperhero } from '@/hooks/useSuperheroes';

interface HeroDetailsProps {
    heroId: string | null;
    open: boolean;
    onClose: () => void;
    onEdit: (heroId: string) => void;
    onDelete: (id: string) => void;
}

export default function HeroDetails({ heroId, open, onClose, onEdit, onDelete }: HeroDetailsProps) {
    const { data: hero, isLoading } = useSuperhero(heroId);

    if (!heroId && !open) return null;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden border-0 p-0 sm:max-w-4xl text-white">
                <DialogTitle className="sr-only">Superhero Details</DialogTitle>

                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : hero ? (
                    <>
                        <div className="flex-none relative flex min-h-40 flex-col justify-end bg-slate-950 p-8 text-white">
                            <div className="flex items-end justify-between gap-4">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                                        {hero.nickname}
                                    </h2>
                                    <DialogDescription className="text-lg font-medium text-slate-400">
                                        {hero.realName}
                                    </DialogDescription>
                                </div>

                                <Button
                                    onClick={() => onEdit(hero.id)}
                                    variant="secondary"
                                    size="sm"
                                    className="hidden gap-2 font-medium sm:flex"
                                >
                                    <Pencil className="h-4 w-4" /> Edit Hero
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto bg-slate-50">
                            <div className="flex flex-col gap-8 p-8">
                                <div className="relative rounded-lg bg-slate-200/50 px-6 py-5">
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-lg bg-slate-900" />
                                    <p className="font-serif text-lg italic text-slate-700">
                                        &ldquo;{hero.catchPhrase}&rdquo;
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <SectionHeader title="Origin Story" />
                                    <p className="text-base leading-relaxed text-slate-600">
                                        {hero.originDescription}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <SectionHeader title="Superpowers" />
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {hero.superpowers?.length ? (
                                            hero.superpowers.map((power) => (
                                                <div
                                                    key={power}
                                                    className="flex items-center gap-3 rounded-md bg-slate-200/60 px-4 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-200"
                                                >
                                                    <Zap className="h-4 w-4 text-slate-500" />
                                                    {power}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-400 italic">No superpowers listed.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <SectionHeader title="Gallery" />
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                        {(hero.images || []).map((img) => (
                                            <div
                                                key={img.id}
                                                className="group relative aspect-square overflow-hidden rounded-lg bg-slate-200 shadow-sm"
                                            >
                                                <Image
                                                    src={getImageUrl(img.imagePath)}
                                                    alt={hero.nickname}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    unoptimized
                                                />
                                            </div>
                                        ))}
                                        {!(hero.images || []).length && (
                                            <div className="col-span-full flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-100 text-slate-400">
                                                No images available
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-none border-t bg-white p-4 sm:p-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                                <Button
                                    variant="destructive"
                                    className="w-full sm:w-auto"
                                    onClick={() => onDelete(hero.id)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Superhero
                                </Button>
                                <Button
                                    onClick={() => onEdit(hero.id)}
                                    variant="outline"
                                    className="w-full sm:hidden"
                                >
                                    <Pencil className="mr-2 h-4 w-4" /> Edit Hero
                                </Button>
                            </div>
                        </div>
                    </>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}

function SectionHeader({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="h-1 w-6 rounded-full bg-slate-900" />
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>
    );
}
