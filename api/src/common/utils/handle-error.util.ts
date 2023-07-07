import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';
import { EXCEPTION_AUTH, EXCEPTION_COMMON } from '../constants/exception';

export const exceptionHandler = (error) => {
  if (error instanceof HttpException) {
    return error;
  }

  if (
    error?.name === 'TokenExpiredError' ||
    error?.name === 'JsonWebTokenError'
  ) {
    const jwtError = jwtExceptionHandler(error);
    if (jwtError instanceof HttpException) return jwtError;
  }

  if (error instanceof TypeORMError) {
    switch (true) {
      case (error as any).code === 'ER_DUP_ENTRY':
        return new BadRequestException(EXCEPTION_COMMON.DB_ENTITY_DUP_ENTRY);
      case error instanceof EntityNotFoundError:
        return new BadRequestException(EXCEPTION_COMMON.DB_ENTITY_NOT_FOUND);
      case error instanceof QueryFailedError:
        return new BadRequestException(EXCEPTION_COMMON.DB_QUERY_WRONG);
      default:
        return new InternalServerErrorException(
          EXCEPTION_COMMON.DB_FAILED_PROCESS,
        );
    }
  }

  return new InternalServerErrorException(
    EXCEPTION_COMMON.SOMETHING_WENT_WRONG,
  );
};

export const jwtExceptionHandler = (error) => {
  if (error?.name === 'TokenExpiredError') {
    return new UnauthorizedException(EXCEPTION_AUTH.USER_TOKEN_EXPIRED);
  }
  if (error?.name === 'JsonWebTokenError') {
    /**
     * ref : https://github.com/auth0/node-jsonwebtoken#jsonwebtokenerror
     */
    switch (true) {
      case String(error.message).includes('invalid token'):
      case String(error.message).includes('jwt malformed'):
        return new UnauthorizedException(
          EXCEPTION_AUTH.USER_TOKEN_WRONG_FORMAT,
        );
      case String(error.message).includes('jwt signature is required'):
      case String(error.message).includes('invalid signature'):
        return new UnauthorizedException(EXCEPTION_AUTH.USER_TOKEN_WRONG);
      default:
        break;
    }
  }

  return error;
};
