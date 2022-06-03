import {
  BadRequestException,
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
import { lastValueFrom } from 'rxjs';

import { BASE_URL, CATEGORIES_EVENTS } from 'src/shared/constants';
import { ClientProxyService } from '../client-proxy/client-proxy.service';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { UpdateCategoryDTO } from './dtos/updateCategory.dto';

@Controller(BASE_URL)
export class CategoriesController {
  constructor(private readonly clientProxyService: ClientProxyService) {}
  private clientAdminBackend =
    this.clientProxyService.getClientProxyAdminBackend();

  @Post('/categories')
  @UsePipes(ValidationPipe)
  async create(@Body() createCategoryDTO: CreateCategoryDTO) {
    const category = await lastValueFrom(
      this.clientAdminBackend.send(
        CATEGORIES_EVENTS.FIND_ONE,
        createCategoryDTO.name,
      ),
    );

    console.log({ category });

    if (category) {
      throw new BadRequestException(
        `This category "${createCategoryDTO.name}" already exists`,
      );
    } else {
      this.clientAdminBackend.emit(CATEGORIES_EVENTS.CREATE, createCategoryDTO);
    }
  }

  @Get('/categories')
  findAll(@Query('searchQuery') searchQuery = '') {
    return this.clientAdminBackend.send(
      CATEGORIES_EVENTS.FIND_ALL,
      searchQuery,
    );
  }

  @Get('/categories/:query')
  findOne(@Param('query') data: string) {
    return this.clientAdminBackend.send(CATEGORIES_EVENTS.FIND_ONE, data);
  }

  @Put('/categories/:id')
  @UsePipes(ValidationPipe)
  update(
    @Body() updateCategoryDTO: UpdateCategoryDTO,
    @Param('id') id: string,
  ) {
    this.clientAdminBackend.emit(CATEGORIES_EVENTS.UPDATE, {
      id,
      data: updateCategoryDTO,
    });
  }

  @Delete('/categories/:id')
  delete(@Param('id') id: string) {
    this.clientAdminBackend.emit(CATEGORIES_EVENTS.DELETE, id);
  }
}
