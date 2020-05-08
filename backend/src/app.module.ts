import { Module } from '@nestjs/common';
import { AppController, AppWSGateway } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AppWSGateway],
})
export class AppModule {}
