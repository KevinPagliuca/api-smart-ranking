import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePlayerDTO {
  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsMongoId()
  category: string;
}
