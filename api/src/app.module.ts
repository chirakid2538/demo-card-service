import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import mysqlCon from '@/common/configs/mysql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MYSQL_MAIN } from './common/constants';
import { AuthModule } from './auth/auth.module';
import { AuthUserTokenMiddleware } from './middleware/auth-user-token.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [mysqlCon] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: MYSQL_MAIN,
      useFactory: async (config: ConfigService) => {
        return config.get('mysql.con');
      },
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthUserTokenMiddleware).forRoutes({
      path: 'auth/user',
      method: RequestMethod.GET,
    });
  }
}
