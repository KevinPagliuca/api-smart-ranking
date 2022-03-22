import { Document } from 'mongoose';

export interface Player extends Document {
  readonly phone_number: string;
  readonly email: string;
  name: string;
  ranking: string;
  ranking_position: number;
  photo_url: string;
}
