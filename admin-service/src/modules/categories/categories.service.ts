import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { ICategory } from 'src/modules/categories/interfaces/category.interface';
import { PlayersService } from '../players/players.service';

interface VerifyCategoryExistsParams {
  id?: string;
  name?: string;
  exception?: boolean | string;
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<ICategory>,
    private readonly playersService: PlayersService,
  ) {}

  async verifyCategoryExists(data: VerifyCategoryExistsParams) {
    const { name, exception, id } = data;
    let findedCategory: ICategory;

    if (id && isValidObjectId(id)) {
      findedCategory = await this.categoryModel
        .findById(id)
        .populate('players')
        .exec();
    } else if (name) {
      findedCategory = await this.categoryModel
        .findOne({ name: name.toUpperCase() })
        .populate('players')
        .exec();
    }

    if (!findedCategory && !!exception) {
      throw new RpcException(
        typeof exception === 'string' ? exception : 'Category not found',
      );
    }

    return findedCategory || null;
  }

  async create(data: ICategory) {
    const category = await this.categoryModel
      .findOne({ name: data.name.toUpperCase() })
      .populate('players')
      .exec();

    if (category) throw new RpcException('Category already exists');

    const createdCategory = await new this.categoryModel({
      name: data.name.toUpperCase(),
      ...data,
    }).save();
    return createdCategory;
  }

  async update(id: string, data: Partial<ICategory>) {
    const category = await this.verifyCategoryExists({ id, exception: true });

    return await this.categoryModel
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            ...data,
            name: category.name,
          },
        },
        { new: true },
      )
      .populate('players')
      .exec();
  }

  async assignPlayer(categoryId: string, playerId: string) {
    const category = await this.verifyCategoryExists({
      id: categoryId,
      exception: true,
    });
    const player = await this.playersService.verifyPlayerExists({
      id: playerId,
      exception: true,
    });

    const findedPlayerExistsOnCategory = await this.categoryModel
      .findById(categoryId)
      .where('players')
      .equals(playerId)
      .exec();

    if (findedPlayerExistsOnCategory) {
      throw new RpcException('Player already assigned on this category');
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

  async findAll() {
    const categories = await this.categoryModel
      .find()
      .populate('players')
      .exec();
    return categories;
  }

  async findById(id: string) {
    const category = await this.categoryModel
      .findById(id)
      .populate('players')
      .exec();
    return category;
  }

  async findByName(name: string) {
    const category = await this.categoryModel
      .findOne({ name: name.toUpperCase() })
      .populate('players')
      .exec();
    return category;
  }

  async findByIdOrName(data: string) {
    let category: ICategory;
    if (isValidObjectId(data)) {
      category = await this.findById(data);
    } else {
      category = await this.findByName(data);
    }
    return category;
  }

  async findByPlayerId(playerId: string) {
    const categories = await this.categoryModel
      .findOne({ players: playerId })
      .populate('players')
      .exec();
    return categories;
  }

  async delete(id: string) {
    await this.verifyCategoryExists({ id, exception: true });
    return await this.categoryModel.deleteOne({ _id: id });
  }
}
