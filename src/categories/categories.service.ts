import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { ICategory } from './interfaces/category.interface';
import { Model, isValidObjectId } from 'mongoose';
import { UpdateCategoryDTO } from './dtos/updateCategory.dto';
import { AssignPlayerOnCategoryDTO } from './dtos/assignPlayerOnCategory.dto';
import { PlayersService } from 'src/players/players.service';

interface VerifyCategoryExists {
  id?: string;
  category?: string;
  exception?: boolean | string;
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<ICategory>,
    private readonly playerService: PlayersService,
  ) {}

  async verifyCategoryExists(data: VerifyCategoryExists) {
    const { category, exception, id } = data;
    let findedCategory: ICategory;

    if (id) {
      findedCategory = await this.categoryModel
        .findById(id)
        .populate('players')
        .exec();
    } else if (category) {
      findedCategory = await this.categoryModel
        .findOne({ name: { $regex: new RegExp(category, 'i') } })
        .populate('players')
        .exec();
    }

    if (!findedCategory && !!exception) {
      throw new NotFoundException(
        typeof exception === 'string' ? exception : 'Category not found',
      );
    }

    return findedCategory || null;
  }

  async create(createCategoryDTO: CreateCategoryDTO) {
    const category = await this.verifyCategoryExists({
      category: createCategoryDTO.name,
      exception: false,
    });

    if (category) throw new BadRequestException('Category already exists');

    const createdCategory = await new this.categoryModel(
      createCategoryDTO,
    ).save();

    return createdCategory;
  }

  async update(id: string, updateCategoryDTO: UpdateCategoryDTO) {
    const category = await this.verifyCategoryExists({ id, exception: true });

    return await this.categoryModel
      .findOneAndUpdate(
        { _id: id },
        { $set: { ...category, ...updateCategoryDTO, name: category.name } },
        { new: true },
      )
      .populate('players')
      .exec();
  }

  async findAll(category?: string) {
    return await this.categoryModel
      .find({
        name: { $regex: new RegExp(category, 'i') },
      })
      .populate('players')
      .exec();
  }

  async findOne(searchQuery: string) {
    if (isValidObjectId(searchQuery)) {
      return await this.verifyCategoryExists({
        id: searchQuery,
        exception: true,
      });
    } else {
      return await this.verifyCategoryExists({
        category: searchQuery,
        exception: true,
      });
    }
  }

  async findById(id: string) {
    return await this.verifyCategoryExists({ id, exception: true });
  }

  async findByCategory(category: string) {
    return await this.verifyCategoryExists({ category, exception: true });
  }

  async findCategoryByPlayerId(playerId: string) {
    return await this.categoryModel
      .findOne({ players: playerId })
      .populate('players')
      .exec();
  }

  async delete(id: string) {
    await this.verifyCategoryExists({ id, exception: true });
    return await this.categoryModel.deleteOne({ _id: id });
  }

  async assignPlayerOnCategory({
    categoryId,
    playerId,
  }: AssignPlayerOnCategoryDTO) {
    const category = await this.verifyCategoryExists({
      id: categoryId,
      exception: true,
    });

    const player = await this.playerService.verifyPlayerExists({
      id: playerId,
      exception: true,
    });

    const findedPlayerExistsOnCategory = await this.categoryModel
      .findById(categoryId)
      .where('players')
      .equals(playerId)
      .exec();

    if (findedPlayerExistsOnCategory) {
      throw new BadRequestException('Player already assigned on this category');
    }

    category.players.push(player);

    return await this.categoryModel
      .findOneAndUpdate(
        { _id: category._id },
        { $set: category },
        { new: true },
      )
      .populate('players')
      .exec();
  }
}
