import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ACKERRORS_CATEGORIES, CATEGORIES_EVENTS } from 'src/shared/constants';
import { ICategory } from 'src/modules/categories/interfaces/category.interface';
import { CategoryService } from './categories.service';
import { UpdateCategoryPayload } from './interfaces/update-category.payload';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @EventPattern(CATEGORIES_EVENTS.CREATE)
  async create(@Payload() category: ICategory, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();
    try {
      const categoryCreated = await this.categoryService.create(category);
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

  @MessagePattern(CATEGORIES_EVENTS.FIND_ALL)
  async findAll(@Payload() data: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();
    try {
      if (data) {
        return (await this.categoryService.findByIdOrName(data)) || [];
      } else {
        return await this.categoryService.findAll();
      }
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @MessagePattern(CATEGORIES_EVENTS.FIND_ONE)
  async findOne(@Payload() data: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();
    try {
      return await this.categoryService.findByIdOrName(data);
    } finally {
      await channel.ack(originalMessage);
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
      const categoryUpdated = await this.categoryService.update(
        payload.id,
        payload.data,
      );
      console.log({ categoryUpdated });
      await channel.ack(originalMessage);
      return categoryUpdated;
    } catch (error) {
      console.log(error.message);
      ACKERRORS_CATEGORIES.forEach(async (item) => {
        if (error.message.includes(item)) {
          await channel.ack(originalMessage, false, false);
        }
      });
    }
  }

  @EventPattern(CATEGORIES_EVENTS.DELETE)
  async delete(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const originalMessage = ctx.getMessage();
    try {
      const categoryDeleted = await this.categoryService.delete(id);
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
