import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { RMQ_CONFIG } from 'src/shared/constants';

@Injectable()
export class ClientProxyService {
  getClientProxyAdminBackend(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: RMQ_CONFIG.urls,
        queue: RMQ_CONFIG.queue,
        noAck: RMQ_CONFIG.noAck,
      },
    });
  }
}
