import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageMulterOptions } from './config/multer-config';
import { ImageService } from './image.service';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', imageMulterOptions))
  uploadImage(
    @UploadedFile()
    image: Express.Multer.File,
  ) {
    return this.imageService.uploadImage(image);
  }
}
