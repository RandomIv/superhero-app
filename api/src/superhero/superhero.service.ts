import { Injectable } from '@nestjs/common';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Superhero } from '../generated/prisma/client';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import {
  SuperheroPreview,
  superheroPreviewSelect,
} from './types/superhero-preview.type';
import { PaginatedResult } from './types/paginated-result.type';

@Injectable()
export class SuperheroService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateSuperheroDto): Promise<Superhero> {
    const { images, ...heroData } = data;
    return this.prisma.superhero.create({
      data: {
        ...heroData,
        images: { create: images },
      },
      include: { images: true },
    });
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<SuperheroPreview>> {
    const { limit = 5, page = 1 } = query;

    const data = await this.prisma.superhero.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: superheroPreviewSelect,
      orderBy: { createdAt: 'asc' },
    });
    const total = await this.prisma.superhero.count();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Superhero> {
    return this.prisma.superhero.findUniqueOrThrow({
      where: { id },
      include: { images: true },
    });
  }

  async update(id: string, data: UpdateSuperheroDto): Promise<Superhero> {
    const { images, ...heroData } = data;
    if (images) {
      await this.prisma.superheroImage.deleteMany({
        where: { superheroId: id },
      });
    }
    return this.prisma.superhero.update({
      where: { id },
      data: { ...heroData, images: { create: images } },
      include: { images: true },
    });
  }

  async remove(id: string) {
    return this.prisma.superhero.delete({
      where: { id },
      include: { images: true },
    });
  }
}
