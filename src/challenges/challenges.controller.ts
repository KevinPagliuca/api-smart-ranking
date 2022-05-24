import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ParamValidator } from 'src/shared/pipes/paramValidator.pipe';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDTO } from './dtos/createChallenge.dto';
import { IChallengeStatus } from './interfaces/challenge.interface';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post('/')
  @UsePipes(ValidationPipe)
  async create(@Body() createChallengeDTO: CreateChallengeDTO) {
    return await this.challengesService.create(createChallengeDTO);
  }

  @Get('/')
  async findAll() {
    return await this.challengesService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.challengesService.findById(id);
  }

  @Get('/find/status')
  @UsePipes(ValidationPipe)
  async findAllStatus(
    @Query('status', ParamValidator) status: IChallengeStatus,
  ) {
    return await this.challengesService.findAllByStatus(status);
  }

  @Get('/find/player')
  @UsePipes(ValidationPipe)
  async findAllByPlayerId(@Query('id', ParamValidator) playerId: string) {
    return await this.challengesService.findAllByPlayerId(playerId);
  }

  @Get('/find/category')
  @UsePipes(ValidationPipe)
  async findAllByCategoryId(@Query('id', ParamValidator) categoryId: string) {
    return await this.challengesService.findAllByCategoryId(categoryId);
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.challengesService.delete(id);
    return { message: 'Successfully deleted challenge' };
  }
}
