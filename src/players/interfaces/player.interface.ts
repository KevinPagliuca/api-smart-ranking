export interface Player {
  readonly _id: string;
  readonly phone_number: string;
  readonly email: string;
  name: string;
  ranking: string;
  ranking_position: number;
  photo_url: string;
  // readonly created_at: Date;
  // readonly updated_at: Date;
}
