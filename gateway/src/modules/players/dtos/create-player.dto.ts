import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreatePlayerDTO {
  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;
}
