import { TypeOrmModuleOptions } from "@nestjs/typeorm";

console.log('env', process.env.DATABASE_HOST)
export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: '192.168.1.63',
    port: 5432,
    username: 'postgres',
    password: 'reverse',
    database: 'taskmanagement',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true
}