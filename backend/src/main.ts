import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws'
import { readFileSync } from 'fs';
import { join } from 'path';

const httpsPort = process.env.PORT ?? 443;
const keysPath = join(__dirname, '../../letsencrypt/archive/pokropinski.xyz/');

const httpsOptions = {
  key: readFileSync( keysPath + 'privkey1.pem', 'utf8' ),
  cert: readFileSync( keysPath + 'cert1.pem', 'utf8' ),
  ca: readFileSync( keysPath + 'chain1.pem', 'utf8' ),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors( { origin: 'https://pokropinski.xyz', credentials: true } );

  await app.listen(httpsPort);
  Logger.log(`Listening at port: ${httpsPort}...`)
}
bootstrap();
