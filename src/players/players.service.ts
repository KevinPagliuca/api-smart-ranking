import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/createPlayer.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player')
    private readonly playerModel: Model<Player>,
  ) {}

  async createUpdatePlayer(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const { email } = createPlayerDTO;

    const findedPlayer = await this.playerModel.findOne({ email }).exec();

    if (!findedPlayer) {
      return await this.create(createPlayerDTO);
    }
    return await this.update(findedPlayer, createPlayerDTO);
  }

  private async create(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const createdPlayer = new this.playerModel(createPlayerDTO);
    return await createdPlayer.save();
  }

  private async update(
    findedPlayer: Player,
    updatePlayerDTO: CreatePlayerDTO,
  ): Promise<Player> {
    return await this.playerModel
      .findOneAndUpdate(
        { email: findedPlayer.email },
        { $set: updatePlayerDTO },
      )
      .exec();
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getPlayerById(id: string): Promise<Player> {
    const findedPlayer = await this.playerModel.findById({ id }).exec();
    if (!findedPlayer) {
      throw new NotFoundException('Jogaor não encontrado');
    } else {
      return findedPlayer;
    }
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const findedPlayer = await this.playerModel.findOne({ email }).exec();

    if (!findedPlayer) {
      throw new NotFoundException('Jogaor não encontrado');
    } else {
      return findedPlayer;
    }
  }

  async deletePlayerById(id: string): Promise<void> {
    return await this.playerModel.remove({ id }).exec();
  }
}
