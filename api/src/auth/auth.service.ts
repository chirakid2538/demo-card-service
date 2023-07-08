import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as jwt from 'jsonwebtoken';

import { hash } from '@/common/utils';
import { MYSQL_MAIN } from '@/common/constants';
import { EXCEPTION_AUTH } from '@/common/constants/exception';
import { User } from '@/entity/user.entity';

import { SignInDTO, SignUpDTO } from './auth.dto';
import { SignDataJWT } from './auth.interface';

const JWT_SECRET = String(process.env.JWT_SECRET);

@Injectable()
export class AuthService {
  private readonly ttlJWT = 60 * 60;
  constructor(
    @InjectDataSource(MYSQL_MAIN)
    private readonly dataSource: DataSource,
  ) {}

  async signUp(params: SignUpDTO): Promise<Omit<User, 'password'>> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const user = new User();
      user.displayName = String(params.displayName);
      user.email = String(params.email);
      user.password = await hash.encode(params.password);
      await queryRunner.manager.save(User, user);
      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async signIn(params: SignInDTO): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    let user: User;
    try {
      await queryRunner.startTransaction();
      user = await queryRunner.manager.findOneByOrFail(User, {
        email: String(params.email),
      });

      if ((await user.validPassword(params.password)) === false) {
        throw new BadRequestException(EXCEPTION_AUTH.PASSWORD_WRONG);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    const signData: SignDataJWT = {
      sub: user.id,
      email: user.email,
      displayName: user.displayName,
      profileImageURL: user.getProfileImageURL(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
    const idToken = jwt.sign(signData, JWT_SECRET, {
      expiresIn: this.ttlJWT,
    });

    return idToken;
  }

  async updateProfileImage({
    userId,
    file,
  }: {
    file: Express.Multer.File;
    userId: number;
  }): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();

      await queryRunner.manager.update(
        User,
        { id: Number(userId) },
        { profileImage: file.path },
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async verifyIdToken(idToken: string): Promise<SignDataJWT> {
    const signData = jwt.verify(idToken, JWT_SECRET);
    return signData;
  }
}
