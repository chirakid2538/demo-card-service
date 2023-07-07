import { Body, Controller, Get, Post } from '@nestjs/common';
import { exceptionHandler } from '@/common/utils';
import { SignInDTO, SignUpDTO } from './auth.dto';
import {
  CurrentUser,
  GetCurrentUser,
} from '../decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { SignDataJWT } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpDTO): Promise<{ uid: number }> {
    try {
      const user = await this.authService.signUp(body);
      return { uid: user.id };
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  @Post('sign-in')
  async signIn(@Body() body: SignInDTO): Promise<{ idToken: string }> {
    try {
      const idToken = await this.authService.signIn(body);
      return { idToken };
    } catch (error) {
      throw exceptionHandler(error);
    }
  }

  @Get('user')
  async sessionIdToken(
    @GetCurrentUser() user: CurrentUser,
  ): Promise<SignDataJWT> {
    try {
      return user.getJWTData();
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
