import * as mongoose from 'mongoose';
import { IChallengeStatus } from './challenge.interface';

export const IChallengeSchema = new mongoose.Schema(
  {
    dateTime_challenge: { type: Date },
    dateTime_request: { type: Date },
    dateTime_answer: { type: Date },
    category: { type: String },
    status: { type: String, enum: IChallengeStatus },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  },
  {
    timestamps: true,
    collection: 'challenges',
  },
);
