import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { CreatePlayerDTO } from './dtos/createPlayer.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Post()
  async createUpdatePlayer(@Body() createPlayerDTO: CreatePlayerDTO) {
    await this.playerService.createUpdatePlayer(createPlayerDTO);
  }

  @Get()
  async getAllPlayers() {
    return this.playerService.getAllPlayers();
  }

  @Get(':id')
  async getPlayerById(@Param('id') id: string) {
    return this.playerService.getPlayerById(id);
  }

  @Delete(':id')
  async deletePlayerById(@Param('id') id: string) {
    await this.playerService.delete(id);
  }
}
