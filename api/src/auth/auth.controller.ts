import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { exceptionHandler } from '@/common/utils';
import { EXCEPTION_COMMON } from '@/common/constants/exception';
import { imageFileFilter } from '@/common/filters/image-file.filter';
import { UploadFileInterceptor } from '@/common/interceptors/upload-file.interceptor';
import {
  CurrentUser,
  GetCurrentUser,
} from '@/common/decorators/current-user.decorator';
import { SignInDTO, SignUpDTO } from './auth.dto';

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

  @Patch('user/profile-image')
  @UseInterceptors(
    UploadFileInterceptor({
      fieldName: 'file',
      path: 'user/avatar',
      fileFilter: imageFileFilter,
    }),
  )
  async updateProfileImage(
    @GetCurrentUser() user: CurrentUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!file) throw new BadRequestException(EXCEPTION_COMMON.FILE_REQUIRED);
      await this.authService.updateProfileImage({ file, userId: user.getId() });
      return {};
    } catch (error) {
      throw exceptionHandler(error);
    }
  }
}
