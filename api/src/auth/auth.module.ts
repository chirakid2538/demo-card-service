import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MYSQL_MAIN } from '@/common/constants';
import { User } from '@/entity/user.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User], MYSQL_MAIN)],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
