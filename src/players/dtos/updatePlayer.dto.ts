import { IsNotEmpty } from 'class-validator';

export class UpdatePlayerDTO {
  @IsNotEmpty()
  readonly phone_number: string;

  @IsNotEmpty()
  readonly name: string;
}
