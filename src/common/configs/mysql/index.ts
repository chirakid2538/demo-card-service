import { registerAs } from '@nestjs/config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export default registerAs(
  'mysql.con',
  (): MysqlConnectionOptions => ({
    type: process.env.MYSQL_PROTOCOL as 'mysql' | 'mariadb',
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    logging: process.env.MYSQL_LOGGING === '1',
    entities: [__dirname + '/../../../**/*.entity{.ts,.js}'],
    synchronize: false,
    migrationsTableName: 'migration_table',
    migrations: [__dirname + '/../../../migrations/*{.ts,.js}'],
    migrationsRun: true,
  }),
);
