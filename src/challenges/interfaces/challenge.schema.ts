import * as mongoose from 'mongoose';
import { IChallengeStatus } from './challenge.interface';

export const IChallengeSchema = new mongoose.Schema(
  {
    dateTimeChallenge: { type: Date },
    dateTimeAnswer: { type: Date },
    status: { type: String, enum: IChallengeStatus },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  },
  { timestamps: true, collection: 'challenges' },
);
