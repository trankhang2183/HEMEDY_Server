import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ConfigResult,
  ConfigResultDocument,
} from './entities/config_result.entity';
import { CreateConfigResultDto } from './dto/create-config_result.dto';
import { UpdateConfigResultDto } from './dto/update-config_result.dto';

@Injectable()
export class ConfigResultService {
  constructor(
    @InjectModel(ConfigResult.name)
    private readonly configResultModel: Model<ConfigResultDocument>,
  ) {}

  async createConfigResult(
    createConfigResultDto: CreateConfigResultDto,
  ): Promise<ConfigResult> {
    if (createConfigResultDto.min_score > createConfigResultDto.max_score) {
      throw new BadGatewayException('Max score must be greater than min score');
    }
    const checkExistConfig = await this.configResultModel.findOne({
      min_score: createConfigResultDto.min_score,
      max_score: createConfigResultDto.max_score,
    });
    if (checkExistConfig) {
      throw new BadGatewayException(
        `Config Result with min score ${createConfigResultDto.min_score} and max score ${createConfigResultDto.max_score} is already exist`,
      );
    }
    const newConfigResult = new this.configResultModel(createConfigResultDto);
    return newConfigResult.save();
  }

  async getAllConfigResult(): Promise<ConfigResult[]> {
    return this.configResultModel.find().exec();
  }

  async getConfigResultByMinMaxScore(
    min_score: number,
    max_score: number,
  ): Promise<ConfigResult> {
    const configResult = await this.configResultModel
      .findOne({ min_score, max_score })
      .exec();
    if (!configResult) {
      throw new NotFoundException(
        `ConfigResult with min score: ${min_score} and max score ${max_score} not found`,
      );
    }
    return configResult;
  }

  async getConfigResultByScore(score: number): Promise<ConfigResult> {
    const configResult = await this.configResultModel
      .findOne({ min_score: { $lte: score }, max_score: { $gte: score } })
      .exec();

    if (!configResult) {
      throw new NotFoundException(
        `ConfigResult suitable for score ${score} not found`,
      );
    }

    return configResult;
  }

  async updateConfigResultByScore(
    min_score: number,
    max_score: number,
    updateConfigResultDto: UpdateConfigResultDto,
  ): Promise<ConfigResult> {
    const updatedConfigResult = await this.configResultModel
      .findOneAndUpdate({ min_score, max_score }, updateConfigResultDto, {
        new: true,
      })
      .exec();

    if (!updatedConfigResult) {
      throw new NotFoundException(
        `ConfigResult with min score: ${min_score} and max score ${max_score} not found`,
      );
    }
    return updatedConfigResult;
  }

  async removeConfigResult(score: number): Promise<void> {
    const result = await this.configResultModel
      .findOneAndDelete({ score })
      .exec();
    if (!result) {
      throw new NotFoundException(`ConfigResult with score ${score} not found`);
    }
  }
}
