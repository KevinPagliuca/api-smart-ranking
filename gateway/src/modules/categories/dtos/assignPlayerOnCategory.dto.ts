import { IsNotEmpty, IsString } from 'class-validator';

export class AssignPlayerOnCategoryDTO {
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  playerId: string;
}
