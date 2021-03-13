import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  let logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  let configServer = config.get('server');
 
  if (process.env.NODE_ENV === 'develoment') { 
    app.enableCors();
  }

  await app.listen(configServer.port);

  logger.log(`Application listerning on port ${configServer.port}`)
}
bootstrap();
