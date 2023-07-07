"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('mysql.con', () => ({
    type: process.env.MYSQL_PROTOCOL,
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
}));
//# sourceMappingURL=index.js.map