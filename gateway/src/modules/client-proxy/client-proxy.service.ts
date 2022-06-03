import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { RMQ_CONFIG } from 'src/shared/env/constants';

@Injectable()
export class ClientProxyService {
  getClientProxyAdminBackend(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: RMQ_CONFIG,
    });
  }
}
