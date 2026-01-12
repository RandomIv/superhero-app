import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as heroService from '@/services/superhero.service';
import { CreateSuperheroDto, UpdateSuperheroDto } from '@/types';

export const useSuperheroes = (page: number, limit: number) => {
    return useQuery({
        queryKey: ['superheroes', page],
        queryFn: () => heroService.getSuperheroes(page, limit),
        placeholderData: (previousData) => previousData,
    });
};

export const useSuperhero = (id: string | null) => {
    return useQuery({
        queryKey: ['superhero', id],
        queryFn: () => heroService.getSuperheroById(id!),
        enabled: !!id,
    });
};

export const useCreateSuperhero = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSuperheroDto) => heroService.createSuperhero(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['superheroes'] });
        },
    });
};

export const useUpdateSuperhero = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateSuperheroDto }) =>
            heroService.updateSuperhero(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['superheroes'] });
            queryClient.invalidateQueries({ queryKey: ['superhero', data.id] });
        },
    });
};

export const useDeleteSuperhero = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => heroService.deleteSuperhero(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['superheroes'] });
        },
    });
};

export const useUploadImage = () => {
    return useMutation({
        mutationFn: (file: File) => heroService.uploadImage(file),
    });
};
