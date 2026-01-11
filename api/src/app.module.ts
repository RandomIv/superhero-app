import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SuperheroModule } from './superhero/superhero.module';
import { ImageModule } from './image/image.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SuperheroModule,
    ImageModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'images'),
      serveRoot: '/images',
    }),
  ],
})
export class AppModule {}
