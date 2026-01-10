import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

export class CreateSuperheroImageDto {
  @IsNotEmpty()
  @IsString()
  imagePath: string;
}

export class CreateSuperheroDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsString()
  realName: string;

  @IsNotEmpty()
  @IsString()
  originDescription: string;

  @IsArray()
  @IsString({ each: true })
  superpowers: string[];

  @IsNotEmpty()
  @IsString()
  catchPhrase: string;

  @Optional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSuperheroImageDto)
  images: CreateSuperheroImageDto[];
}
