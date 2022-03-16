import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/createPlayer.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [
    {
      _id: uuidv4(),
      email: 'kevin.pagliuca@outlook.com',
      name: 'Kevin Pagliuca',
      phone_number: '+55 (11) 98888-8888',
      photo_url: 'https://www.github.com/kevinpagliuca.png',
      ranking: 'A',
      ranking_position: 1,
    },
  ];

  private readonly logger = new Logger(PlayersService.name);

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

  async createUpdatePlayer(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    const { email } = createPlayerDTO;

    const findedPlayer = this.players.find((player) => player.email === email);

    if (!findedPlayer) {
      await this.create(createPlayerDTO);
    }

    await this.update(findedPlayer, createPlayerDTO);
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.players;
  }

  async getPlayerById(id: string): Promise<Player> {
    const player = this.players.find((player) => player._id === id);
    if (!player) {
      throw new NotFoundException('Jogador não encontrado');
    }
    return player;
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const player = this.players.find((player) => player.email === email);
    if (!player) {
      throw new NotFoundException('Jogador não encontrado');
    }
    return player;
  }

  async deletePlayerById(id: string): Promise<void> {
    const player = this.players.find((player) => player._id === id);

    if (!player) {
      throw new NotFoundException('Jogador não encontrado');
    }

    this.players = this.players.filter((player) => player._id !== id);
  }
}
