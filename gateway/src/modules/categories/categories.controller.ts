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
import {
  ASSIGN_PLAYERS_EVENTS,
  BASE_URL,
  CATEGORIES_EVENTS,
  PLAYERS_EVENTS,
} from 'src/shared/env/constants';

import { ClientProxyService } from '../client-proxy/client-proxy.service';
import { AssignPlayerCategoryDTO } from './dtos/assign-player-category.dto';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';

@Controller(`${BASE_URL}/categories`)
export class CategoriesController {
  constructor(private readonly clientProxyService: ClientProxyService) {}
  private clientAdminBackend =
    this.clientProxyService.getClientProxyAdminBackend();

  @Post('/')
  @UsePipes(ValidationPipe)
  async create(@Body() createCategoryDTO: CreateCategoryDTO) {
    const category = await lastValueFrom(
      this.clientAdminBackend.send(
        CATEGORIES_EVENTS.FIND_ONE,
        createCategoryDTO.name,
      ),
    );

    if (category) {
      throw new BadRequestException(`This category already exists`);
    } else {
      this.clientAdminBackend.emit(CATEGORIES_EVENTS.CREATE, createCategoryDTO);
    }
  }

  @Post('/assign-player')
  @UsePipes(ValidationPipe)
  async assignPlayer(@Body() assignPlayerCategoryDTO: AssignPlayerCategoryDTO) {
    const { playerId, categoryId } = assignPlayerCategoryDTO;

    const category = await lastValueFrom(
      this.clientAdminBackend.send(CATEGORIES_EVENTS.FIND_ONE, categoryId),
    );

    if (!category) {
      throw new BadRequestException(`This category does not exist`);
    }

    const player = await lastValueFrom(
      this.clientAdminBackend.send(PLAYERS_EVENTS.FIND_ONE, playerId),
    );

    if (!player) {
      throw new BadRequestException(`This player does not exist`);
    }

    const playerOnCategory = await lastValueFrom(
      this.clientAdminBackend.send(CATEGORIES_EVENTS.FIND_BY_PLAYER, playerId),
    );

    if (playerOnCategory) {
      throw new BadRequestException(
        `This player already belongs to a category`,
      );
    }

    this.clientAdminBackend.emit(
      ASSIGN_PLAYERS_EVENTS.CATEGORY_ASSIGN,
      assignPlayerCategoryDTO,
    );
  }

  @Get('/')
  findAll(@Query('name') name = '') {
    return this.clientAdminBackend.send(CATEGORIES_EVENTS.FIND_ALL, name);
  }

  @Get('/:query')
  async findOne(@Param('query') data: string) {
    const findedPlayer = await lastValueFrom(
      this.clientAdminBackend.send(CATEGORIES_EVENTS.FIND_ONE, data),
    );

    if (!findedPlayer) {
      throw new BadRequestException(`This category does not exists`);
    }

    return findedPlayer;
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async update(
    @Body() updateCategoryDTO: UpdateCategoryDTO,
    @Param('id') id: string,
  ) {
    const category = await lastValueFrom(
      this.clientAdminBackend.send(CATEGORIES_EVENTS.FIND_ONE, id),
    );
    if (!category) {
      throw new BadRequestException(`This category does not exists`);
    } else {
      this.clientAdminBackend.emit(CATEGORIES_EVENTS.UPDATE, {
        id,
        data: updateCategoryDTO,
      });
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const category = await lastValueFrom(
      this.clientAdminBackend.send(CATEGORIES_EVENTS.FIND_ONE, id),
    );
    if (!category) {
      throw new BadRequestException(`This category does not exists`);
    } else {
      this.clientAdminBackend.emit(CATEGORIES_EVENTS.DELETE, id);
      return { message: 'Category successfully deleted' };
    }
  }
}
