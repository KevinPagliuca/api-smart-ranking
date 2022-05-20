import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { ICategorySchema } from './interfaces/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: ICategorySchema }]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
