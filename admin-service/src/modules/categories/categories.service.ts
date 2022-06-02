import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { ICategory } from 'src/modules/categories/interfaces/category.interface';

interface VerifyCategoryExistsParams {
  id?: string;
  name?: string;
  exception?: boolean | string;
}

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<ICategory>,
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
        .findOne({ name: { $regex: new RegExp(name, 'i') } })
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
    const category = await this.verifyCategoryExists({ name: data.name });

    if (category) throw new RpcException('Category already exists');

    const createdCategory = await new this.categoryModel(data).save();
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
      .findOne({ name: { $regex: new RegExp(name, 'i') } })
      .populate('players')
      .exec();
    return category;
  }

  async findByIdOrName(data: string) {
    let categories: ICategory[] | ICategory;
    if (isValidObjectId(data)) {
      categories = await this.findById(data);
    } else {
      categories = await this.findByName(data);
    }
    return categories;
  }

  async delete(id: string) {
    await this.verifyCategoryExists({ id, exception: true });
    return await this.categoryModel.deleteOne({ _id: id });
  }
}
