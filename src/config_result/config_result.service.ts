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

@Injectable()
export class ConfigResultService {
  constructor(
    @InjectModel(ConfigResult.name)
    private readonly configResultModel: Model<ConfigResultDocument>,
  ) {}

  async createConfigResult(createConfigResultDto: any): Promise<ConfigResult> {
    const checkExistScore = await this.configResultModel.findOne({
      score: createConfigResultDto.score,
    });
    if (checkExistScore) {
      throw new BadGatewayException(
        'ConfigResult with score ' +
          createConfigResultDto.score +
          ' already exists',
      );
    }
    const newConfigResult = new this.configResultModel(createConfigResultDto);
    return newConfigResult.save();
  }

  async getAllConfigResult(): Promise<ConfigResult[]> {
    return this.configResultModel.find().exec();
  }

  async getConfigResultByScore(score: number): Promise<ConfigResult> {
    const configResult = await this.configResultModel.findOne({ score }).exec();
    if (!configResult) {
      throw new NotFoundException(`ConfigResult with score ${score} not found`);
    }
    return configResult;
  }

  async updateConfigResultByScore(
    score: number,
    updateConfigResultDto: any,
  ): Promise<ConfigResult> {
    const updatedConfigResult = await this.configResultModel
      .findOneAndUpdate({ score }, updateConfigResultDto, { new: true })
      .exec();

    if (!updatedConfigResult) {
      throw new NotFoundException(`ConfigResult with score ${score} not found`);
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
