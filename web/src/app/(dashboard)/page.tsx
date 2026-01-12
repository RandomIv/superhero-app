'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeleteSuperhero, useCreateSuperhero, useUpdateSuperhero } from '@/hooks/useSuperheroes';
import { CreateSuperheroDto, UpdateSuperheroDto } from '@/types';
import HeroDetails from '@/app/(dashboard)/_components/hero-details';
import HeroForm from '@/app/(dashboard)/_components/hero-form';
import HeroList from "@/app/(dashboard)/_components/hero-list";
import { toast } from 'sonner';

export default function Home() {
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const deleteHero = useDeleteSuperhero();
  const createHero = useCreateSuperhero();
  const updateHero = useUpdateSuperhero();

  const handleDelete = async (id: string) => {
    try {
      await deleteHero.mutateAsync(id);
      if (viewingId === id) setViewingId(null);
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
      setEditingId(null);
      toast.success('Superhero updated');
    } catch (error) {
      toast.error('Failed to update superhero');
    }
  };

  const openEditFromDetails = (heroId: string) => {
    setViewingId(null);
    setEditingId(heroId);
  };

  const isFormOpen = isCreateOpen || Boolean(editingId);
  const formMode = editingId ? 'edit' : 'create';

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
            onSelect={(hero) => setViewingId(hero.id)}
            onDelete={handleDelete}
            isDeletingId={deleteHero.isPending ? deleteHero.variables : null}
        />

        <HeroDetails
            heroId={viewingId}
            open={Boolean(viewingId)}
            onClose={() => setViewingId(null)}
            onEdit={openEditFromDetails}
            onDelete={handleDelete}
        />

        <HeroForm
            open={isFormOpen}
            mode={formMode}
            heroId={editingId}
            onOpenChange={(open) => {
              if (!open) {
                setIsCreateOpen(false);
                setEditingId(null);
              }
            }}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
        />
      </main>
  );
}
