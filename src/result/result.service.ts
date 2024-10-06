import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnswerService } from '../answer/answer.service'; // Dịch vụ tìm Answer
import { Result, ResultDocument } from './entities/result.entity';
import { ConfigResultService } from 'src/config_result/config_result.service';
import { CreateResultDto } from './dto/create-result.dto';

@Injectable()
export class ResultService {
  constructor(
    @InjectModel(Result.name)
    private readonly resultModel: Model<ResultDocument>,
    private readonly configResultService: ConfigResultService,
    private readonly answerService: AnswerService,
  ) {}

  async createResult(
    createResultDto: CreateResultDto,
    user: any,
  ): Promise<Result> {
    const { list_answer_id } = createResultDto;

    const answers = await this.answerService.findAnswersByIds(list_answer_id);

    const scoreMap = new Map<string, number>();
    for (const answer_id of list_answer_id) {
      scoreMap.set(answer_id, (scoreMap.get(answer_id) || 0) + 1);
    }

    let totalScore = 0;
    for (const answer of answers) {
      const count = scoreMap.get(answer._id.toString()) || 0;
      totalScore += answer.score * count;
    }

    const configResult =
      await this.configResultService.getConfigResultByScore(totalScore);
    if (!configResult) {
      throw new NotFoundException(
        `ConfigResult with score ${totalScore} not found`,
      );
    }

    const updateExistingResult = await this.resultModel
      .findOneAndUpdate(
        { user_id: user._id },
        {
          result_content: configResult.result_content,
          score: totalScore,
          suggestion: configResult.suggestion,
        },
        { new: true },
      )
      .exec();
    if (updateExistingResult) {
      return updateExistingResult;
    }

    // Tạo dữ liệu cho Result dựa trên dữ liệu của ConfigResult
    const newResult = new this.resultModel({
      result_content: configResult.result_content,
      score: totalScore,
      suggestion: configResult.suggestion,
      user_id: user._id,
    });

    return newResult.save();
  }

  async getAllResults(): Promise<Result[]> {
    const results = await this.resultModel.find().populate('user_id');
    if (!results) {
      throw new InternalServerErrorException(
        'Something went wrong loading results',
      );
    }
    return results;
  }

  async getResultOfUser(user: any): Promise<Result> {
    const result = await this.resultModel.findOne({ user_id: user._id }).exec();
    if (!result) {
      throw new NotFoundException(`User has not completed any surveys yet.`);
    }
    return result;
  }

  async getResultById(id: string): Promise<Result> {
    const result = await this.resultModel.findById(id).populate('user_id');
    if (!result) {
      throw new NotFoundException(`User has not completed any surveys yet.`);
    }
    return result;
  }

  async removeResult(id: string): Promise<void> {
    const result = await this.resultModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Result with id ${id} not found`);
    }
  }
}
