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
  ) {}

  async verifyCategoryExists(data: VerifyCategoryExists) {
    const { category, exception, id } = data;
    let findedCategory: ICategory;

    if (id && isValidObjectId(id)) {
      findedCategory = await this.categoryModel.findById(id).exec();
    } else if (category) {
      findedCategory = await this.categoryModel
        .findOne({ category: { $regex: new RegExp(category, 'i') } })
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
      category: createCategoryDTO.category,
      exception: false,
    });

    if (category) throw new BadRequestException('Category already exists');

    const createdCategory = await new this.categoryModel(
      createCategoryDTO,
    ).save();

    return createdCategory;
  }

  async update(id: string, updateCategoryDTO: UpdateCategoryDTO) {
    await this.verifyCategoryExists({ id, exception: true });

    return await this.categoryModel
      .findOneAndUpdate({ _id: id }, { $set: updateCategoryDTO }, { new: true })
      .exec();
  }

  async findAll(category?: string) {
    return await this.categoryModel
      .find({
        category: { $regex: new RegExp(category, 'i') },
      })
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

  async delete(id: string) {
    await this.verifyCategoryExists({ id, exception: true });
    return await this.categoryModel.deleteOne({ _id: id });
  }
}
