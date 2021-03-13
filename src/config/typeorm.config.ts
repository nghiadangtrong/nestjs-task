import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config';

const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: process.env.TYPE || dbConfig.type,
    host: process.env.HOST ||  dbConfig.host,
    port: process.env.PORT || dbConfig.port,
    username: process.env.USER_NAME || dbConfig.username,
    password: process.env.PASSWORD || dbConfig.password,
    database: process.env.DATABASE || dbConfig.database,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize
}
