import { FileInterceptor } from '@nestjs/platform-express';
import {
  BadRequestException,
  Injectable,
  mixin,
  NestInterceptor,
  PayloadTooLargeException,
  Type,
} from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { EXCEPTION_COMMON } from '../constants/exception';

interface UploadFileInterceptorOptions {
  fieldName: string;
  path?: string;
  fileFilter?: MulterOptions['fileFilter'];
  limits?: MulterOptions['limits'];
}

const MAX_SIZE = 1024 * 1024 * 3;
export function UploadFileInterceptor(
  options: UploadFileInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    constructor() {
      const rootDir = process.env.UPLOADED_DESTINATION ?? 'public/upload';

      const destination = `${rootDir}/${options.path}`;
      const limits = options?.limits ?? {};
      if (limits?.fileSize === undefined) limits.fileSize = MAX_SIZE;

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          filename: (req, file, cb) => {
            const originalname = decodeURIComponent(file.originalname);
            const fileName = `${uuidv4()}-${originalname}`;
            cb(null, fileName);
          },
          destination,
        }),
        fileFilter: options.fileFilter,
        limits: limits,
      };

      this.fileInterceptor = new (FileInterceptor(
        options.fieldName,
        multerOptions,
      ))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return (this.fileInterceptor.intercept(...args) as any).catch((err) => {
        if (err instanceof PayloadTooLargeException) {
          throw new PayloadTooLargeException(EXCEPTION_COMMON.FILE_TOO_LARGE);
        }
        if (err instanceof BadRequestException) {
          throw new BadRequestException(EXCEPTION_COMMON.FILE_REQUIRED);
        }
        throw err;
      });
    }
  }
  return mixin(Interceptor);
}
