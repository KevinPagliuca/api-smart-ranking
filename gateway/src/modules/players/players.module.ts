import { Module } from '@nestjs/common';
import { ClientProxyModule } from '../client-proxy/client-proxy.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PlayersController } from './players.controller';

@Module({
  imports: [CloudinaryModule, ClientProxyModule],
  controllers: [PlayersController],
  providers: [],
})
export class PlayersModule {}
