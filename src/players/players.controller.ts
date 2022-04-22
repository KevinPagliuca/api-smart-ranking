import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreatePlayerDTO } from './dtos/createPlayer.dto';
import { ParamValidatorPlayer } from './pipes/param-validator.pipe';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createUpdatePlayer(@Body() createPlayerDTO: CreatePlayerDTO) {
    return await this.playerService.createUpdatePlayer(createPlayerDTO);
  }

  @Get()
  async getAllPlayers() {
    return await this.playerService.getAllPlayers();
  }

  @Get('/email')
  async getPlayerByEmail(@Query('email', ParamValidatorPlayer) email: string) {
    return await this.playerService.getPlayerByEmail(email);
  }

  @Delete(':id')
  async deletePlayerById(@Param('id') id: string) {
    await this.playerService.deletePlayerById(id);
    return { message: 'Successfully deleted player' };
  }
}
