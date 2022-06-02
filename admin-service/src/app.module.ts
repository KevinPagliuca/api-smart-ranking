import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './modules/categories/categories.module';
import { PlayersModule } from './modules/players/players.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.MONGOOSE_URI),
    CategoryModule,
    PlayersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
