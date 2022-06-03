import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/categories/categories.module';
import { PlayersModule } from './modules/players/players.module';

@Module({
  imports: [CategoriesModule, PlayersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
