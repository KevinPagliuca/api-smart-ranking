import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/filters/httpException.filter';

import * as momentTimezone from 'moment-timezone';

const PORT = process.env.PORT || 3333;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());

  Date.prototype.toJSON = () =>
    momentTimezone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');

  await app.listen(PORT, () =>
    console.log(`Server is Running in PORT: ${PORT} 🔥🚀`),
  );
}

bootstrap();
