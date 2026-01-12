import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

const imageFileFilter = (req, file, callback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  if (!allowed.includes(file.mimetype)) {
    return callback(new BadRequestException('Invalid image type'), false);
  }

  callback(null, true);
};

const imageStorage = diskStorage({
  destination: './images',
  filename: (req, file, callback) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    callback(null, `hero-${unique}${ext}`);
  },
});

export const imageMulterOptions = {
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
};
