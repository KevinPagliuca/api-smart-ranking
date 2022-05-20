import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IPlayerSchema } from './interfaces/player.schema';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Player', schema: IPlayerSchema }]),
  ],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [
    PlayersService,
    MongooseModule.forFeature([{ name: 'Player', schema: IPlayerSchema }]),
  ],
})
export class PlayersModule {}
