import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { PlayersModule } from 'src/players/players.module';
import { IChallengeSchema } from './interfaces/challenge.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from 'src/categories/categories.module';
import { IGameSchema } from './interfaces/game.schema';

@Module({
  imports: [
    PlayersModule,
    CategoriesModule,
    MongooseModule.forFeature([
      { name: 'Challenge', schema: IChallengeSchema },
      { name: 'Game', schema: IGameSchema },
    ]),
  ],
  providers: [ChallengesService],
  controllers: [ChallengesController],
})
export class ChallengesModule {}
