import { IPlayer } from './player.interface';

export class UpdatePlayerPayload {
  id: string;
  data: Partial<IPlayer>;
}
