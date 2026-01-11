import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SuperheroImage } from '../generated/prisma/client';

@Injectable()
export class ImageService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadImage(image: Express.Multer.File): Promise<SuperheroImage> {
    const path = `/images/${image.filename}`;
    return this.prisma.superheroImage.create({
      data: {
        imagePath: path,
      },
    });
  }
}
