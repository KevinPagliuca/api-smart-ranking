import { Module } from '@nestjs/common';
import { ClientProxyModule } from '../client-proxy/client-proxy.module';
import { PlayersController } from './players.controller';

@Module({
  imports: [ClientProxyModule],
  controllers: [PlayersController],
  providers: [],
})
export class PlayersModule {}
