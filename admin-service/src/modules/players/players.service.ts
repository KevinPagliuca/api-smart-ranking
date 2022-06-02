import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { IPlayer } from './interfaces/player.interface';

interface VerifyPlayerExistsParams {
  name?: string;
  id?: string;
  exception?: boolean | string;
}

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<IPlayer>,
  ) {}

  async verifyPlayerExists(data: VerifyPlayerExistsParams) {
    const { name, exception, id } = data;
    let findedPlayer: IPlayer;

    if (id && isValidObjectId(id)) {
      findedPlayer = await this.playerModel.findById(id).exec();
    } else if (name) {
      findedPlayer = await this.playerModel
        .findOne({ name: { $regex: new RegExp(name, 'i') } })
        .exec();
    }

    if (!findedPlayer && !!exception) {
      throw new RpcException(
        typeof exception === 'string' ? exception : 'Category not found',
      );
    }

    return findedPlayer || null;
  }

  async create(data: IPlayer) {
    const player = await this.verifyPlayerExists({ name: data.name });

    if (player) throw new RpcException('Player already exists');

    const createdPlayer = await new this.playerModel(data).save();
    return createdPlayer;
  }

  async update(id: string, data: Partial<IPlayer>) {
    const { email } = await this.verifyPlayerExists({ id, exception: true });

    return await this.playerModel
      .findOneAndUpdate(
        { _id: id },
        { $set: { ...data, email } },
        { new: true },
      )
      .exec();
  }

  async findAll() {
    const players = await this.playerModel
      .find()
      .populate({
        path: 'category',
        select: ['id', 'name', 'description'],
      })
      .exec();
    return players;
  }

  async findById(id: string) {
    const player = await this.playerModel.findById(id).exec();
    return player;
  }

  async findByName(name: string) {
    const player = await this.playerModel
      .findOne({ name: { $regex: new RegExp(name, 'i') } })
      .exec();
    return player;
  }

  async findByIdOrName(data: string) {
    let player: IPlayer;
    if (isValidObjectId(data)) {
      player = await this.findById(data);
    } else {
      player = await this.findByName(data);
    }
    return player;
  }

  async delete(id: string) {
    await this.verifyPlayerExists({ id, exception: true });
    return await this.playerModel.deleteOne({ _id: id });
  }
}
