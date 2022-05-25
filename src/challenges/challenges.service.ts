import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IChallenge, IChallengeStatus } from './interfaces/challenge.interface';
import { Model, isValidObjectId } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDTO } from './dtos/createChallenge.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { UpdateChallengeDTO } from './dtos/updateChallenge.dto';

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

    const createdChallenge = await new this.challengeModel(
      newChallengeDTO,
    ).populate('players');

    return await createdChallenge.save();
  }

  async update(id: string, dto: UpdateChallengeDTO, updatePlayerId: string) {
    const challenge = await this.findById(id);

    if (!challenge) {
      throw new BadRequestException('Challenge not found');
    }

    const isRequesterPlayerRequesting =
      challenge.requester._id.toString() === updatePlayerId;

    return await this.challengeModel
      .findOneAndUpdate(
        { _id: challenge._id },
        {
          $set: {
            status: isRequesterPlayerRequesting ? challenge.status : dto.status,
            dateTimeChallenge: dto.dateTimeChallenge,
            dateTimeAnswer:
              !isRequesterPlayerRequesting &&
              dto.status === IChallengeStatus.ACCEPTED
                ? new Date()
                : null,
          },
        },
        { new: true },
      )
      .populate('players')
      .exec();
  }

  async findAll() {
    return await this.challengeModel.find().populate('players');
  }

  async findById(id: string) {
    return await this.challengeModel
      .findById(id)
      .populate(['category', 'players']);
  }

  async findAllByPlayerId(playerId: string) {
    if (!isValidObjectId(playerId)) {
      throw new BadRequestException('Player id is invalid');
    }

    return await this.challengeModel
      .find({ players: playerId })
      .populate(['category', 'players']);
  }

  async findAllByCategoryId(categoryId: string) {
    if (!isValidObjectId(categoryId)) {
      throw new BadRequestException('Category id is invalid');
    }

    return await this.challengeModel
      .find({ category: categoryId })
      .populate(['category', 'players']);
  }

  async findAllByStatus(status: IChallengeStatus) {
    return await this.challengeModel
      .find({ status })
      .populate(['category', 'players']);
  }

  async delete(id: string) {
    const challenge = await this.findById(id);

    if (!challenge) {
      throw new BadRequestException('Challenge not found');
    }

    return this.challengeModel.deleteOne({ _id: challenge._id });
  }
}
