import { Injectable } from '@nestjs/common';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Superhero, Prisma } from '../generated/prisma/client';

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

  async findAll(): Promise<Superhero[]> {
    return this.prisma.superhero.findMany({ include: { images: true } });
  }

  async findOne(id: string): Promise<Superhero | null> {
    return this.prisma.superhero.findUnique({
      where: { id },
      include: { images: true },
    });
  }

  async update(id: string, data: UpdateSuperheroDto): Promise<Superhero> {
    const { images, ...heroData } = data;
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
