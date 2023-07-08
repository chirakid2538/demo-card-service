import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { join } from 'path';
import { convertError } from '@/common/utils';
import { AppModule } from './app.module';
import { EXCEPTION_COMMON } from './common/constants/exception';

const PORT = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const responseError = convertError({}, errors);
        throw new BadRequestException({
          statusCode: 400,
          message: EXCEPTION_COMMON.VALIDATE_FAILED,
          errors: responseError,
        });
      },
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(PORT);
}
bootstrap();
