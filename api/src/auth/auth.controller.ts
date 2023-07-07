import { Body, Controller, Post } from '@nestjs/common';
import { exceptionHandler } from '@/common/utils';
import { SignInDTO, SignUpDTO } from './auth.dto';
import { AuthService } from './auth.service';

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
  async signIn(@Body() body: SignInDTO): Promise<{ userToken: string }> {
    try {
      const userToken = await this.authService.signIn(body);
      return { userToken };
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
