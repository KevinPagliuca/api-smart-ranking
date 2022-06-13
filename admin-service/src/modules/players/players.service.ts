import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { IPlayer } from './interfaces/player.interface';

interface VerifyPlayerExistsParams {
  email?: string;
  id?: string;
  exception?: boolean | string;
}

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<IPlayer>,
  ) {}

  async verifyPlayerExists(data: VerifyPlayerExistsParams) {
    const { email, exception, id } = data;
    let findedPlayer: IPlayer;

    if (id && isValidObjectId(id)) {
      findedPlayer = await this.playerModel
        .findById(id)
        .populate({
          path: 'category',
          select: ['id', 'name', 'description'],
        })
        .exec();
    } else if (email) {
      findedPlayer = await this.playerModel
        .findOne({ email: { $regex: new RegExp(email, 'i') } })
        .populate({
          path: 'category',
          select: ['id', 'name', 'description'],
        })
        .exec();
    }

    if (!findedPlayer && !!exception) {
      throw new RpcException(
        typeof exception === 'string' ? exception : 'Player not found',
      );
    }

    return findedPlayer || null;
  }

  async create(data: IPlayer) {
    const player = await this.verifyPlayerExists({ email: data.email });

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
      .populate({
        path: 'category',
        select: ['id', 'name', 'description'],
      })
      .exec();
  }

  async findAll(name: string) {
    const players = await this.playerModel
      .find()
      .where('name', { $regex: new RegExp(name, 'i') })
      .populate({
        path: 'category',
        select: ['id', 'name', 'description'],
      })
      .exec();
    return players;
  }

  async findById(id: string) {
    const player = await this.playerModel
      .findById(id)
      .populate({
        path: 'category',
        select: ['id', 'name', 'description'],
      })
      .exec();
    return player;
  }

  async findByEmail(email: string) {
    const player = await this.playerModel
      .findOne({ email: { $regex: new RegExp(email, 'i') } })
      .populate({
        path: 'category',
        select: ['id', 'name', 'description'],
      })
      .exec();
    return player;
  }

  async findByIdOrEmail(data: string) {
    let player: IPlayer;
    if (isValidObjectId(data)) {
      player = await this.findById(data);
    } else {
      player = await this.findByEmail(data);
    }
    return player;
  }

  async delete(id: string) {
    await this.verifyPlayerExists({ id, exception: true });
    return await this.playerModel.deleteOne({ _id: id });
  }
}
