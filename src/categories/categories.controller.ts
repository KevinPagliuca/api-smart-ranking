import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AssignPlayerOnCategoryDTO } from './dtos/assignPlayerOnCategory.dto';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { UpdateCategoryDTO } from './dtos/updateCategory.dto';

@Controller(['api/v1/categories', 'api/v1/category'])
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('/')
  @UsePipes(ValidationPipe)
  async create(@Body() createCategoryDTO: CreateCategoryDTO) {
    return await this.categoriesService.create(createCategoryDTO);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDTO: UpdateCategoryDTO,
  ) {
    return await this.categoriesService.update(id, updateCategoryDTO);
  }

  @Post('/:categoryId/assign-player/:playerId')
  @UsePipes(ValidationPipe)
  async assignPlayerOnCategory(@Param() params: AssignPlayerOnCategoryDTO) {
    const { categoryId, playerId } = params;
    return await this.categoriesService.assignPlayerOnCategory({
      categoryId,
      playerId,
    });
  }

  @Get('/')
  async findAll(@Query('category') category?: string) {
    return await this.categoriesService.findAll(category);
  }

  @Get('/:id')
  async findById(@Param('id') id: string) {
    return await this.categoriesService.findById(id);
  }

  @Get('/find/:searchQuery')
  async findOne(@Param('searchQuery') searchQuery: string) {
    return await this.categoriesService.findOne(searchQuery);
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  async delete(@Param('id') id: string) {
    await this.categoriesService.delete(id);
    return { message: 'Successfully deleted category' };
  }
}
