import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUppercase,
} from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: IEvent[];
}

export interface IEvent {
  name: string;
  operation: string;
  value: number;
}
