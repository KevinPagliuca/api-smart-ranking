import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { IPlayer } from 'src/players/interfaces/player.interface';
import { IEvent } from '../interfaces/category.interface';

export class UpdateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: IEvent[];

  players: IPlayer[];
}
