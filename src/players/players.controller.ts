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
import { ParamValidatorPlayer } from './pipes/param-validator.pipe';
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
    @Body() createPlayerDTO: CreatePlayerDTO,
    @Param('id') id: string,
  ) {
    return await this.playerService.update(id, createPlayerDTO);
  }

  @Get()
  async getAllPlayers() {
    return await this.playerService.getAllPlayers();
  }

  @Get('/email')
  async getPlayerByEmail(@Query('email', ParamValidatorPlayer) email: string) {
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
