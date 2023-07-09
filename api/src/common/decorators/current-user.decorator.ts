import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SignDataJWT } from '../../auth/auth.interface';

export type CurrentUser = {
  getId: () => number;
  getJWTData: () => SignDataJWT;
};

export const GetCurrentUser = createParamDecorator(
  (data, host: ExecutionContext): CurrentUser => {
    const [req] = host.getArgs();
    const user = req['x-user'] as SignDataJWT;

    return {
      getId: () => Number(user.sub),
      getJWTData: () => user,
    };
  },
);
