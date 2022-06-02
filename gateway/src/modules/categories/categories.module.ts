import { Module } from '@nestjs/common';
import { ClientProxyModule } from '../client-proxy/client-proxy.module';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [ClientProxyModule],
  providers: [],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
