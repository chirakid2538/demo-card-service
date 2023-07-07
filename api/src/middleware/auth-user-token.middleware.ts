import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EXCEPTION_AUTH } from '@/common/constants/exception';
import { exceptionHandler } from '@/common/utils';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthUserTokenMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: () => void) {
    const token = req.headers.authorization;
    if (!token)
      throw new UnauthorizedException(EXCEPTION_AUTH.REQUIRED_USER_TOKEN);

    try {
      const decodedToken = await this.authService.verifyIdToken(
        token.replace('Bearer ', ''),
      );
      req['x-user'] = decodedToken;
      next();
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
