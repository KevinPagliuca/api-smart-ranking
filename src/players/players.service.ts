import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/createPlayer.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';

import { Model, isValidObjectId } from 'mongoose';
import { UpdatePlayerDTO } from './dtos/updatePlayer.dto';

interface VerifyPlayerExistsParams {
  email?: string;
  id?: string;
  exception?: boolean;
}

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player')
    private readonly playerModel: Model<Player>,
  ) {}

  private async verifyPlayerExists({
    email,
    id,
    exception = true,
  }: VerifyPlayerExistsParams): Promise<Player | null> {
    let player: Player;

    if (email) {
      player = await this.playerModel.findOne({ email }).exec();
    } else if (id && isValidObjectId(id)) {
      player = await this.playerModel.findOne({ _id: id }).exec();
    }

    if (!player && exception) {
      throw new NotFoundException('Player not found');
    }

    return player || null;
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

  async update(_id: string, updatePlayerDTO: UpdatePlayerDTO): Promise<Player> {
    await this.verifyPlayerExists({ id: _id });

    return await this.playerModel
      .findOneAndUpdate({ _id }, { $set: updatePlayerDTO }, { new: true })
      .exec();
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
