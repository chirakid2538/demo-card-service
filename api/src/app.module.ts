import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mysqlCon from '@/common/configs/mysql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MYSQL_MAIN } from './common/constants';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
