import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

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
  async getAllPlayers(@Query('email') email: string) {
    if (email) {
      return await this.playerService.getPlayerByEmail(email);
    }
    return await this.playerService.getAllPlayers();
  }

  @Delete(':id')
  async deletePlayerById(@Param('id') id: string) {
    await this.playerService.deletePlayerById(id);
  }
}
