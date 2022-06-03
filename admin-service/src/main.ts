import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { RMQ_CONFIG } from './shared/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: RMQ_CONFIG.urls,
      queue: RMQ_CONFIG.queue,
      noAck: RMQ_CONFIG.noAck,
    },
  });

  await app.listen();
}
bootstrap();
