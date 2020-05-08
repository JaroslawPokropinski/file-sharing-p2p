import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Observable, Subscriber } from 'rxjs';

class Host {
  id: string;
  subscriber: Subscriber<any> | null = null;
  observable: Observable<any> = new Observable(subscriber => this.subscriber = subscriber);
  signals: Array<any> = [];
  constructor(id: string) {
    this.id = id;

  }

  getSignals(): Array<any> {
    return this.signals;
  }

  sendSignal(signal: any) {
    if (this.subscriber === null) {
      throw new Error('Host is not subscribed!');
    }
    this.subscriber.next(signal);
  }
}

@Injectable()
export class AppService {
  map = new Map<string, Host>();

  getUUID(): string {
    return uuidv4();
  }

  subscribeToID(id: string): Host {
    const host = new Host(id);
    this.map.set(id, host);
    return host;
  }

  signal(id: string, obj: string) {
    Logger.log(`Signal to ${id}`);
    const old = this.map.get(id);
    if (old !== undefined) {
      old.signals.push(obj);
    } else {
      Logger.warn(`Failed to subscribe to ${id}!`);
    }
  }

  getSignals(id: string): Array<string> {
    const host = this.map.get(id);
    if (host !== undefined) {
      return host.getSignals();
    } else {
      throw new HttpException(`Id: ${id} is not subscribed`, HttpStatus.BAD_REQUEST);
    }
  }

  signalToHost(id: string, obj: string) {
    const host = this.map.get(id);
    if (host !== undefined) {
      host.sendSignal(obj);
    } else {
      throw new HttpException(`Id: ${id} is not subscribed`, HttpStatus.BAD_REQUEST);
    }
  }
}
