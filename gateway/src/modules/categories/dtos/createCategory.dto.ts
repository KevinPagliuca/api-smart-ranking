import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
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
