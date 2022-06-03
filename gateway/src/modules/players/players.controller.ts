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
  BASE_URL,
  CATEGORIES_EVENTS,
  PLAYERS_EVENTS,
} from 'src/shared/env/constants';

import { ClientProxyService } from '../client-proxy/client-proxy.service';
import { CreatePlayerDTO } from './dtos/createPlayer.dto';
import { UpdatePlayerDTO } from './dtos/updatePlayer.dto';

@Controller(BASE_URL)
export class PlayersController {
  constructor(private readonly clientProxyService: ClientProxyService) {}
  private clientAdminBackend =
    this.clientProxyService.getClientProxyAdminBackend();

  @Post('/players/')
  @UsePipes(ValidationPipe)
  async create(@Body() createPlayerDTO: CreatePlayerDTO) {
    const category = await lastValueFrom(
      this.clientAdminBackend.send(
        CATEGORIES_EVENTS.FIND_ONE,
        createPlayerDTO.category,
      ),
    );

    const player = await lastValueFrom(
      this.clientAdminBackend.send(
        PLAYERS_EVENTS.FIND_ONE,
        createPlayerDTO.email,
      ),
    );

    if (player) throw new BadRequestException('This email already taken');

    if (category) {
      this.clientAdminBackend.emit(PLAYERS_EVENTS.CREATE, createPlayerDTO);
    } else {
      throw new BadRequestException('The category does not exist');
    }
  }

  @Put('/players/:id')
  @UsePipes(ValidationPipe)
  async update(
    @Body() updatePlayerDTO: UpdatePlayerDTO,
    @Param('id') id: string,
  ) {
    const player = await lastValueFrom(
      this.clientAdminBackend.send(PLAYERS_EVENTS.FIND_ONE, id),
    );

    if (player) {
      this.clientAdminBackend.emit(PLAYERS_EVENTS.UPDATE, {
        id,
        data: updatePlayerDTO,
      });
    } else {
      throw new BadRequestException('The player does not exist');
    }
  }

  @Get('/players')
  findAll(@Query('searchQuery') searchQuery = '') {
    return this.clientAdminBackend.send(PLAYERS_EVENTS.FIND_ALL, searchQuery);
  }

  @Delete('/players/:id')
  delete(@Param('id') id: string) {
    this.clientAdminBackend.emit(PLAYERS_EVENTS.DELETE, id);
  }
}
