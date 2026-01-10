import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SuperheroModule } from './superhero/superhero.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true }), SuperheroModule],
})
export class AppModule {}
