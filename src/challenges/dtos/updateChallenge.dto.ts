import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { IChallengeStatus } from '../interfaces/challenge.interface';

export class UpdateChallengeDTO {
  @IsOptional()
  @IsDateString()
  dateTimeChallenge: Date;

  @IsNotEmpty()
  @IsEnum(IChallengeStatus)
  status: IChallengeStatus;
}
