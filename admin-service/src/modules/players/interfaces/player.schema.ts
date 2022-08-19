import * as mongoose from 'mongoose';

export const IPlayerSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    phone_number: { type: String },
    name: { type: String },
    ranking_position: { type: Number },
    ranking: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    photo_url: { type: String },
    photo_id: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'players',
  },
);
