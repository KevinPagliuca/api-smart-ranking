import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IPlayerSchema } from './interfaces/player.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Player', schema: IPlayerSchema }]),
  ],
  providers: [PlayersService],
  controllers: [PlayersController],
})
export class PlayersModule {}
