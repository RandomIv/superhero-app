'use client';

import { useSuperheroes } from "@/hooks/useSuperheroes";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import HeroCard from "@/app/(dashboard)/_components/hero-card";
import { Superhero } from "@/types";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";

interface HeroListProps {
    page: number;
    setPage: (page: number) => void;
    onSelect: (hero: Superhero) => void;
    onDelete: (id: string) => void;
    isDeletingId: string | null;
}

export default function HeroList({
                                     page,
                                     setPage,
                                     onSelect,
                                     onDelete,
                                     isDeletingId
                                 }: HeroListProps) {
    const PAGE_SIZE = 5;
    const { data, isLoading, isError } = useSuperheroes(page, PAGE_SIZE);

    const heroes = data?.data ?? [];
    const lastPage = data?.lastPage ?? 1;

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <Card className="p-6 text-center text-sm text-muted-foreground bg-destructive/10">
                Failed to load superheroes. Please try again later.
            </Card>
        );
    }

    if (!heroes.length) {
        return (
            <Card className="flex h-64 flex-col items-center justify-center p-6 text-center text-muted-foreground border-dashed">
                <p>No superheroes found.</p>
                <p className="text-sm">Create your first one above!</p>
            </Card>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {heroes.map((hero) => (
                    <HeroCard
                        key={hero.id}
                        hero={hero}
                        onSelect={() => onSelect(hero)}
                        onDelete={() => onDelete(hero.id)}
                        deleting={isDeletingId === hero.id}
                    />
                ))}
            </div>

            <div className="mt-auto py-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (page > 1) setPage(page - 1);
                                }}
                                aria-disabled={page <= 1}
                                className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>

                        <PaginationItem className="flex items-center px-4 text-sm font-medium">
                            Page {page} of {lastPage}
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (page < lastPage) setPage(page + 1);
                                }}
                                aria-disabled={page >= lastPage}
                                className={page >= lastPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
