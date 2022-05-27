import * as mongoose from 'mongoose';

export const IGameSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    def: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    result: [{ set: { type: String } }],
  },
  { timestamps: true, collection: 'games' },
);
