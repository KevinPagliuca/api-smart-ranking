import { Document } from 'mongoose';

import { IPlayer } from '../../players/interfaces/player.interface';

export enum IChallengeStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
  FINISHED = 'FINISHED',
}

export class IChallenge extends Document {
  dateTimeChallenge: Date;
  dateTimeRequest: Date;
  dateTimeAnswer: Date;

  requester: IPlayer;
  players: IPlayer[];

  status: IChallengeStatus;
  category: string;
  game: IGame;
}

export interface IGame extends Document {
  category: string;
  players: IPlayer[];
  def: IPlayer;
  result: IResult;
}

export interface IResult {
  set: string;
}