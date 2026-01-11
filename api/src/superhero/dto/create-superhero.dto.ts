import { IsArray, IsNotEmpty, IsString } from 'class-validator';

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

  @IsArray()
  @IsString({ each: true })
  images: string[];
}
