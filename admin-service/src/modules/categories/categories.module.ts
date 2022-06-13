import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ICategorySchema } from './interfaces/category.schema';
import { IPlayerSchema } from '../players/interfaces/player.schema';
import { CategoriesService } from './categories.service';
import { PlayersModule } from '../players/players.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Category', schema: ICategorySchema },
      { name: 'Player', schema: IPlayerSchema },
    ]),
    PlayersModule,
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
