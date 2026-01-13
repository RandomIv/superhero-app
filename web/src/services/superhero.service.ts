import { client } from '@/lib/fetch-client';
import {
  Superhero,
  PaginatedResponse,
  CreateSuperheroDto,
  UpdateSuperheroDto,
  SuperheroImage,
} from '@/types';

export const getSuperheroes = (page = 1, limit = 5) => {
  return client<PaginatedResponse<Superhero>>('/superheroes', {
    params: { page, limit },
  });
};

export const getSuperheroById = (id: string) => {
  return client<Superhero>(`/superheroes/${id}`);
};

export const createSuperhero = (data: CreateSuperheroDto) => {
  return client<Superhero>('/superheroes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateSuperhero = (id: string, data: UpdateSuperheroDto) => {
  return client<Superhero>(`/superheroes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteSuperhero = (id: string) => {
  return client<{ success: boolean }>(`/superheroes/${id}`, {
    method: 'DELETE',
  });
};

export const uploadImage = (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  return client<SuperheroImage>('/images/upload', {
    method: 'POST',
    body: formData,
  });
};
