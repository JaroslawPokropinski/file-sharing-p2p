import { Module } from '@nestjs/common';
import { AppController, AppWSGateway } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'build'),
      serveRoot: '/fileshare',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppWSGateway],
})
export class AppModule {}
