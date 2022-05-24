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

import { CreatePlayerDTO } from './dtos/createPlayer.dto';
import { UpdatePlayerDTO } from './dtos/updatePlayer.dto';
import { ParamValidator } from '../shared/pipes/paramValidator.pipe';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDTO: CreatePlayerDTO) {
    return await this.playerService.create(createPlayerDTO);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDTO: UpdatePlayerDTO,
    @Param('id') id: string,
  ) {
    return await this.playerService.update(id, updatePlayerDTO);
  }

  @Get()
  async getAllPlayers() {
    return await this.playerService.getAllPlayers();
  }

  @Get('/email')
  async getPlayerByEmail(@Query('email', ParamValidator) email: string) {
    return await this.playerService.getPlayerByEmail(email);
  }

  @Get(':id')
  async getPlayerById(@Param('id') id: string) {
    return await this.playerService.getPlayerById(id);
  }

  @Delete(':id')
  async deletePlayerById(@Param('id') id: string) {
    await this.playerService.deletePlayerById(id);
    return { message: 'Successfully deleted player' };
  }
}
