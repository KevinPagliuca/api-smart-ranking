import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IChallenge, IChallengeStatus } from './interfaces/challenge.interface';
import { Model, isValidObjectId } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDTO } from './dtos/createChallenge.dto';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge')
    private readonly challengeModel: Model<IChallenge>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private async getChallengePlayers(requesterId: string, challengedId: string) {
    if (!isValidObjectId(requesterId) && !isValidObjectId(challengedId)) {
      throw new BadRequestException('Some player id is invalid');
    }

    const [requesterPlayer, challengedPlayer] = await Promise.all([
      this.playersService.verifyPlayerExists({
        id: requesterId,
        exception: 'Requester player not found',
      }),
      this.playersService.verifyPlayerExists({
        id: challengedId,
        exception: 'Challenged player not found',
      }),
    ]);

    return { requesterPlayer, challengedPlayer };
  }

  private async getChallengeCategory(playerId: string) {
    if (!isValidObjectId(playerId)) {
      throw new BadRequestException('Player id is invalid');
    }

    const category = await this.categoriesService.findCategoryByPlayerId(
      playerId,
    );

    if (!category) {
      throw new BadRequestException('Player has no category');
    }

    return category;
  }

  async create(dto: CreateChallengeDTO) {
    const { challengedPlayer, requesterPlayer } =
      await this.getChallengePlayers(
        dto.requesterPlayerId,
        dto.challengedPlayerId,
      );

    const challengeCategory = await this.getChallengeCategory(
      requesterPlayer._id,
    );
    const newChallengeDTO: Partial<IChallenge> = {
      dateTimeChallenge: dto.dateTimeChallenge,
      requester: requesterPlayer._id,
      players: [requesterPlayer._id, challengedPlayer._id],
      category: challengeCategory._id,
      status: IChallengeStatus.PENDING,
    };

    const createdChallenge = new this.challengeModel(newChallengeDTO).save();

    return createdChallenge;
  }

  async findAll() {
    return this.challengeModel.find();
  }

  async findById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Challenge id is invalid');
    }
    return this.challengeModel.findById(id);
  }

  async findAllByPlayerId(playerId: string) {
    if (!isValidObjectId(playerId)) {
      throw new BadRequestException('Player id is invalid');
    }

    return this.challengeModel.find({
      players: playerId,
    });
  }

  async findAllByCategoryId(categoryId: string) {
    if (!isValidObjectId(categoryId)) {
      throw new BadRequestException('Category id is invalid');
    }

    return this.challengeModel.find({
      category: categoryId,
    });
  }

  async findAllByStatus(status: IChallengeStatus) {
    return this.challengeModel.find({
      status,
    });
  }

  async delete(id: string) {
    const challenge = await this.findById(id);

    if (!challenge) {
      throw new BadRequestException('Challenge not found');
    }

    return this.challengeModel.deleteOne({ _id: challenge._id });
  }
}
