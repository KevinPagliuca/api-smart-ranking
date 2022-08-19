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
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { lastValueFrom } from 'rxjs';
import {
  BASE_URL,
  CATEGORIES_EVENTS,
  PLAYERS_EVENTS,
} from 'src/shared/env/constants';
import { IMulterFile } from 'src/shared/types/multer.interfaces';

import { ClientProxyService } from '../client-proxy/client-proxy.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { UpdatePlayerDTO } from './dtos/update-player.dto';

@Controller(`${BASE_URL}/players`)
export class PlayersController {
  constructor(
    private readonly clientProxyService: ClientProxyService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
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
    if (updatePlayerDTO.category) {
      const category = await lastValueFrom(
        this.clientAdminBackend.send(
          CATEGORIES_EVENTS.FIND_ONE,
          updatePlayerDTO.category,
        ),
      );

      if (!category) {
        throw new BadRequestException("The category doesn't exist");
      }
    }

    const player = await lastValueFrom(
      this.clientAdminBackend.send(PLAYERS_EVENTS.FIND_ONE, id),
    );

    if (player) {
      this.clientAdminBackend.emit(PLAYERS_EVENTS.UPDATE, {
        id,
        data: updatePlayerDTO,
      });
    } else {
      throw new BadRequestException("The player doesn't exist");
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

  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: IMulterFile,
    @Param('id') id: string,
  ) {
    const player = await lastValueFrom(
      this.clientAdminBackend.send(PLAYERS_EVENTS.FIND_ONE, id),
    );

    if (player) {
      const result = await this.cloudinaryService.uploadImage({
        file,
        playerId: id,
        photo_id: player?.photo_id,
      });

      if (result.error) {
        throw new BadRequestException(result.error.message);
      }

      this.clientAdminBackend.emit(PLAYERS_EVENTS.UPDATE, {
        id,
        data: { photo_url: result.url, photo_id: result.public_id },
      });

      return {
        message: 'The file has been uploaded successfully',
        url: result.url,
        playerId: id,
        originalName: result.original_filename,
      };
    } else {
      throw new BadRequestException('The player does not exist');
    }
  }

  @Delete('/:id/upload')
  async deleteImage(@Param('id') id: string) {
    const player = await lastValueFrom(
      this.clientAdminBackend.send(PLAYERS_EVENTS.FIND_ONE, id),
    );

    if (player && player?.photo_id) {
      this.clientAdminBackend.send(PLAYERS_EVENTS.UPDATE, {
        id,
        data: { photo_url: undefined, photo_id: undefined },
      });

      return { message: 'The file has been deleted successfully' };
    } else {
      throw new BadRequestException(
        'The player does not have a photo to delete yet',
      );
    }
  }

  @Get('/:id/upload')
  async getImage(@Param('id') id: string) {
    const player = await lastValueFrom(
      this.clientAdminBackend.send(PLAYERS_EVENTS.FIND_ONE, id),
    );

    if (player && player?.photo_id) {
      return this.cloudinaryService.getImage(player?.photo_id);
    } else {
      throw new BadRequestException('The player does not have a photo yet');
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    const player = await lastValueFrom(
      this.clientAdminBackend.send(PLAYERS_EVENTS.FIND_ONE, id),
    );

    if (player) {
      this.clientAdminBackend.emit(PLAYERS_EVENTS.DELETE, id);
    } else {
      throw new BadRequestException('The player does not exist');
    }
  }
}
