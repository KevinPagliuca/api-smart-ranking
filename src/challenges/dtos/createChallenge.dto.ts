import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateChallengeDTO {
  @IsNotEmpty()
  @IsDateString()
  dateTimeChallenge: Date;

  @IsNotEmpty()
  requesterPlayerId: string;

  @IsNotEmpty()
  challengedPlayerId: string;
}
