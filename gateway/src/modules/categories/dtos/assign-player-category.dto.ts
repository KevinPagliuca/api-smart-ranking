import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class AssignPlayerCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  playerId: string;
}
