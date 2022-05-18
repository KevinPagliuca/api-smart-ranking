import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/createPlayer.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';

import { Model, isValidObjectId } from 'mongoose';

interface VerifyPlayerExistsParams {
  email?: string;
  id?: string;
}

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player')
    private readonly playerModel: Model<Player>,
  ) {}

  private async verifyPlayerExists({ email, id }: VerifyPlayerExistsParams) {
    let player: Player;
    if (email) {
      player = await this.playerModel.findOne({ email }).exec();
    } else if (id && isValidObjectId(id)) {
      player = await this.playerModel.findOne({ _id: id }).exec();
    }

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return player;
  }

  async create(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const playerExists = await this.playerModel
      .findOne({
        email: createPlayerDTO.email,
      })
      .exec();

    if (playerExists) {
      throw new BadRequestException('Player already exists');
    }

    const createdPlayer = await new this.playerModel(createPlayerDTO).save();
    return createdPlayer;
  }

  async update(_id: string, updatePlayerDTO: CreatePlayerDTO): Promise<Player> {
    const player = await this.playerModel.findOne({
      _id,
    });

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    await this.playerModel
      .findOneAndUpdate({ _id }, { $set: updatePlayerDTO })
      .exec();

    return player;
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getPlayerById(id: string): Promise<Player> {
    const findedPlayer = await this.verifyPlayerExists({ id });
    return findedPlayer;
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const findedPlayer = await this.verifyPlayerExists({ email });
    return findedPlayer;
  }

  async deletePlayerById(id: string) {
    await this.verifyPlayerExists({ id });
    return await this.playerModel.deleteOne({ _id: id });
  }
}
