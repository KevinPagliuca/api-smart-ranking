import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/createPlayer.dto';
import { IPlayer } from './interfaces/player.interface';
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
    private readonly playerModel: Model<IPlayer>,
  ) {}

  private async verifyPlayerExists({
    email,
    id,
    exception = true,
  }: VerifyPlayerExistsParams): Promise<IPlayer | null> {
    let player: IPlayer;

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

  async create(createPlayerDTO: CreatePlayerDTO): Promise<IPlayer> {
    const player = await this.verifyPlayerExists({
      email: createPlayerDTO.email,
    });

    if (player) {
      throw new BadRequestException('Player already exists');
    }

    const createdPlayer = await new this.playerModel(createPlayerDTO).save();
    return createdPlayer;
  }

  async update(
    _id: string,
    updatePlayerDTO: UpdatePlayerDTO,
  ): Promise<IPlayer> {
    await this.verifyPlayerExists({ id: _id });

    return await this.playerModel
      .findOneAndUpdate({ _id }, { $set: updatePlayerDTO }, { new: true })
      .exec();
  }

  async getAllPlayers(): Promise<IPlayer[]> {
    return await this.playerModel.find().exec();
  }

  async getPlayerById(id: string): Promise<IPlayer> {
    const findedPlayer = await this.verifyPlayerExists({ id });
    return findedPlayer;
  }

  async getPlayerByEmail(email: string): Promise<IPlayer> {
    const findedPlayer = await this.verifyPlayerExists({ email });
    return findedPlayer;
  }

  async deletePlayerById(id: string) {
    await this.verifyPlayerExists({ id });
    return await this.playerModel.deleteOne({ _id: id });
  }
}
