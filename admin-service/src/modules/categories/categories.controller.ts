import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ICategory } from 'src/modules/categories/interfaces/category.interface';
import {
  ACKERRORS_CATEGORIES,
  ASSIGN_PLAYERS_EVENTS,
  CATEGORIES_EVENTS,
} from 'src/shared/env/constants';
import { CategoriesService } from './categories.service';
import { UpdateCategoryPayload } from './interfaces/update-category.payload';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @EventPattern(CATEGORIES_EVENTS.CREATE)
  async create(@Payload() category: ICategory, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();
    try {
      const categoryCreated = await this.categoriesService.create(category);
      await channel.ack(originalMessage);
      return categoryCreated;
    } catch (error) {
      ACKERRORS_CATEGORIES.forEach(async (item) => {
        if (error.message.includes(item)) {
          await channel.ack(originalMessage, false, false);
        }
      });
    }
  }

  @EventPattern(CATEGORIES_EVENTS.UPDATE)
  async update(
    @Payload() payload: UpdateCategoryPayload,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();
    try {
      const categoryUpdated = await this.categoriesService.update(
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

  @EventPattern(CATEGORIES_EVENTS.FIND_BY_PLAYER)
  async findByPlayer(@Payload() playerId: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();
    try {
      const categories = await this.categoriesService.findByPlayerId(playerId);
      await channel.ack(originalMessage);
      return categories;
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern(ASSIGN_PLAYERS_EVENTS.CATEGORY_ASSIGN)
  async assignPlayer(@Payload() data: any, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();
    try {
      const categoryAssigned = await this.categoriesService.assignPlayer(
        data.categoryId,
        data.playerId,
      );
      return categoryAssigned;
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @MessagePattern(CATEGORIES_EVENTS.FIND_ALL)
  async findAll(@Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();
    try {
      return await this.categoriesService.findAll();
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @MessagePattern(CATEGORIES_EVENTS.FIND_ONE)
  async findOne(@Payload() data: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();
    try {
      return await this.categoriesService.findByIdOrName(data);
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern(CATEGORIES_EVENTS.DELETE)
  async delete(@Payload() data: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();
    try {
      const categoryDeleted = await this.categoriesService.delete(data);
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
