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
import { BASE_URL, PLAYERS_EVENTS } from 'src/shared/env/constants';

import { ClientProxyService } from '../client-proxy/client-proxy.service';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { UpdatePlayerDTO } from './dtos/update-player.dto';

@Controller(`${BASE_URL}/players`)
export class PlayersController {
  constructor(private readonly clientProxyService: ClientProxyService) {}
  private clientAdminBackend =
    this.clientProxyService.getClientProxyAdminBackend();

  @Post('/')
  @UsePipes(ValidationPipe)
  async create(@Body() createPlayerDTO: CreatePlayerDTO) {
    const player = await lastValueFrom(
      this.clientAdminBackend.send(
        PLAYERS_EVENTS.FIND_ONE,
        createPlayerDTO.email,
      ),
    );

    if (player) {
      throw new BadRequestException('This email already taken');
    } else {
      this.clientAdminBackend.emit(PLAYERS_EVENTS.CREATE, createPlayerDTO);
    }
  }

  @Put('/:id')
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

  @Get('/')
  findAll(@Query('name') name = '') {
    return this.clientAdminBackend.send(PLAYERS_EVENTS.FIND_ALL, name);
  }

  @Get('/:searchQuery')
  async findOne(@Param('searchQuery') data: string) {
    const player = await lastValueFrom(
      this.clientAdminBackend.send(PLAYERS_EVENTS.FIND_ONE, data),
    );

    if (!player) {
      throw new BadRequestException('Player not found');
    }

    return player;
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    const player = lastValueFrom(
      this.clientAdminBackend.send(PLAYERS_EVENTS.FIND_ONE, id),
    );

    if (player) {
      this.clientAdminBackend.emit(PLAYERS_EVENTS.DELETE, id);
    } else {
      throw new BadRequestException('The player does not exist');
    }
  }
}
