import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/createPlayer.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    const { email } = createPlayerDTO;

    const findedPlayer = this.players.find((player) => player.email === email);

    if (!findedPlayer) {
      await this.create(createPlayerDTO);
    }

    await this.update(findedPlayer, createPlayerDTO);
  }

  private async create(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    const { email, name, phone_number } = createPlayerDTO;

    const player: Player = {
      _id: uuidv4(),
      email,
      name,
      phone_number,
      photo_url: 'https://www.github.com/kevinpagliuca.png',
      ranking: 'A',
      ranking_position: 1,
    };

    this.logger.log(`\nplayer: ${JSON.stringify(player)}`);
    this.players.push(player);
  }

  private async update(
    findedPlayer: Player,
    updatePlayerDTO: CreatePlayerDTO,
  ): Promise<void> {
    const { name } = updatePlayerDTO;

    findedPlayer.name = name;
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.players;
  }

  async getPlayerById(id: string): Promise<Player> {
    return this.players.find((player) => player._id === id);
  }

  async delete(id: string): Promise<void> {
    this.players = this.players.filter((player) => player._id !== id);
  }
}
