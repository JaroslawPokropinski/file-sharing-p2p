import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';

const httpsPort = process.env.PORT ?? 443;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors( { origin: 'https://peer-file-share.netlify.app', credentials: true } );

  await app.listen(httpsPort);
  Logger.log(`Listening at port: ${httpsPort}...`)
}
bootstrap();
