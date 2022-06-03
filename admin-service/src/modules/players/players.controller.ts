import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ACKERRORS_CATEGORIES, PLAYERS_EVENTS } from 'src/shared/env/constants';
import { IPlayer } from './interfaces/player.interface';
import { UpdatePlayerPayload } from './interfaces/update-player.payload';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @EventPattern(PLAYERS_EVENTS.CREATE)
  async create(@Payload() player: IPlayer, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();
    try {
      const createdPlayer = await this.playersService.create(player);
      await channel.ack(originalMessage);
      return createdPlayer;
    } catch (error) {
      ACKERRORS_CATEGORIES.forEach(async (item) => {
        if (error.message.includes(item)) {
          await channel.ack(originalMessage, false, false);
        }
      });
    }
  }

  @MessagePattern(PLAYERS_EVENTS.FIND_ALL)
  async findAll(@Payload() data: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();
    try {
      if (data) {
        return (await this.playersService.findByIdOrName(data)) || [];
      } else {
        return await this.playersService.findAll();
      }
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @MessagePattern(PLAYERS_EVENTS.FIND_ONE)
  async findOne(@Payload() data: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();
    try {
      return await this.playersService.findByIdOrName(data);
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern(PLAYERS_EVENTS.UPDATE)
  async update(
    @Payload() payload: UpdatePlayerPayload,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();
    try {
      const categoryUpdated = await this.playersService.update(
        payload.id,
        payload.data,
      );
      await channel.ack(originalMessage);
      return categoryUpdated;
    } catch (error) {
      ACKERRORS_CATEGORIES.forEach(async (item) => {
        if (error.message.includes(item)) {
          await channel.ack(originalMessage, false, false);
        }
      });
    }
  }

  @EventPattern(PLAYERS_EVENTS.DELETE)
  async delete(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();
    try {
      const categoryDeleted = await this.playersService.delete(id);
      await channel.ack(originalMessage);
      return categoryDeleted;
    } catch (error) {
      ACKERRORS_CATEGORIES.forEach(async (item) => {
        if (error.message.includes(item)) {
          await channel.ack(originalMessage, false, false);
        }
      });
    }
  }
}
