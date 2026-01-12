'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeleteSuperhero, useCreateSuperhero, useUpdateSuperhero } from '@/hooks/useSuperheroes';
import { Superhero, CreateSuperheroDto, UpdateSuperheroDto } from '@/types';
import HeroDetails from '@/app/(dashboard)/_components/hero-details';
import HeroForm from '@/app/(dashboard)/_components/hero-form';
import HeroList from "@/app/(dashboard)/_components/hero-list";
import { toast } from 'sonner';

export default function Home() {
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingHero, setViewingHero] = useState<Superhero | null>(null);
  const [editingHero, setEditingHero] = useState<Superhero | null>(null);

  const deleteHero = useDeleteSuperhero();
  const createHero = useCreateSuperhero();
  const updateHero = useUpdateSuperhero();

  const handleDelete = async (id: string) => {
    try {
      await deleteHero.mutateAsync(id);
      if (viewingHero?.id === id) setViewingHero(null);
      toast.success('Superhero deleted');
    } catch (error) {
      toast.error('Failed to delete superhero');
      console.error(error);
    }
  };

  const handleCreate = async (payload: CreateSuperheroDto) => {
    try {
      await createHero.mutateAsync(payload);
      setIsCreateOpen(false);
      toast.success('Superhero created');
    } catch (error) {
      toast.error('Failed to create superhero');
    }
  };

  const handleUpdate = async (id: string, payload: UpdateSuperheroDto) => {
    try {
      await updateHero.mutateAsync({ id, data: payload });
      setEditingHero(null);
      toast.success('Superhero updated');
    } catch (error) {
      toast.error('Failed to update superhero');
    }
  };

  const openEditFromDetails = (hero: Superhero) => {
    setViewingHero(null);
    setEditingHero(hero);
  };

  const isFormOpen = isCreateOpen || Boolean(editingHero);
  const formMode = editingHero ? 'edit' : 'create';
  const formHero = editingHero ?? undefined;

  return (
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SuperheroDB</h1>
            <p className="text-sm text-muted-foreground">Manage your roster of heroes</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Superhero
          </Button>
        </header>

        <HeroList
            page={page}
            setPage={setPage}
            onSelect={setViewingHero}
            onDelete={handleDelete}
            isDeletingId={deleteHero.isPending ? deleteHero.variables : null}
        />

        <HeroDetails
            hero={viewingHero}
            open={Boolean(viewingHero)}
            onClose={() => setViewingHero(null)}
            onEdit={openEditFromDetails}
            onDelete={(id) => handleDelete(id)}
        />

        <HeroForm
            open={isFormOpen}
            mode={formMode}
            hero={formHero}
            onOpenChange={(open) => {
              if (!open) {
                setIsCreateOpen(false);
                setEditingHero(null);
              }
            }}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
        />
      </main>
  );
}
