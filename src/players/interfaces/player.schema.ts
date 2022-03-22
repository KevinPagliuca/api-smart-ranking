import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    phone_number: { type: String },
    name: { type: String },
    ranking_position: { type: Number },
    ranking: { type: String },
    photo_url: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'players',
  },
);
