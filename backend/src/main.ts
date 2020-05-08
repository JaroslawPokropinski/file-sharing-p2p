import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws'

const port = 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors( { origin: 'http://localhost:3000', credentials: true } );
  await app.listen(port);
  Logger.log(`Listening at port: ${port}...`)
}
bootstrap();
