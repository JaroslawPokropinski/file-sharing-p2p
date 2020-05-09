import { Controller, Get, Post, Body, Query, HttpException, HttpStatus, Logger, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { WsResponse, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Observable, from, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { join } from 'path';

@Controller('fileshare')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('id')
  getUUID(): string {
    const uuid = this.appService.getUUID();
    this.appService.subscribeToID(uuid);

    return uuid;
  }

  @Post('signal')
  postSignal(@Body() body: {uuid: string, signal: string}): void {
    this.appService.signal(body.uuid, body.signal);
  }

  @Post('signal-client')
  postSignalToHost(@Body() body: {uuid: string, signal: string}): void {
    this.appService.signalToHost(body.uuid, body.signal);
  }

  @Get('signal')
  getSignal(@Query('uuid') uuid: string | undefined): string[] {
    if (uuid === undefined) {
      throw new HttpException(`Id: ${uuid} is not subscribed`, HttpStatus.BAD_REQUEST);
    } else {
      return this.appService.getSignals(uuid);
    }
  }
  
  @Get('/app/*')
  getApp(@Res() res: any) {
    res.sendFile(join(__dirname, '..', '..', 'frontend', 'build', 'index.html'));
  }

  
}

@WebSocketGateway()
export class AppWSGateway {
  constructor(private readonly appService: AppService) {}

  @WebSocketServer() server;

  @SubscribeMessage('share')
  onShare(): Observable<WsResponse<any>> {
    Logger.log('host is sharing');
    const host = this.appService.subscribeToID(this.appService.getUUID());

    return merge(
      host.observable.pipe(map(data => ({event: 'signal', data}))),
      from([{event: 'id', data: host.id}]),
    );
  }
}