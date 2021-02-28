import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TaskModule
  ]
})
export class AppModule {}
