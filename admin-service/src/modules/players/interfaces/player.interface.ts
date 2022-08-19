import { Document } from 'mongoose';

export interface IPlayer extends Document {
  readonly phone_number: string;
  readonly email: string;
  category: string;
  name: string;
  ranking: string;
  ranking_position: number;
  photo_url: string;
  photo_id: string;
}
