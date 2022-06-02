import { Document } from 'mongoose';
import { IPlayer } from '../../players/interfaces/player.interface';

export interface ICategory extends Document {
  readonly name: string;
  description: string;
  events: IEvent[];
  players: IPlayer[];
}

export interface IEvent {
  name: string;
  operation: string;
  value: number;
}
