import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { convertError } from '@/common/utils';
import { EXCEPTION_COMMON } from './common/constants/exception';

const PORT = process.env.PORT || 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  await app.listen(PORT);
}
bootstrap();
