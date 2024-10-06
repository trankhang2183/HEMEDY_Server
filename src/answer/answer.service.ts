import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer } from './entities/answer.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(Answer.name)
    private readonly answerModel: Model<Answer>,
  ) {}

  // Create a new answer
  async createAnswer(createAnswerDto: CreateAnswerDto): Promise<Answer> {
    const checkExistAnswerScore = await this.answerModel.findOne({
      score: createAnswerDto.score,
    });
    if (checkExistAnswerScore) {
      throw new BadGatewayException('Score already exists');
    }
    const newAnswer = new this.answerModel(createAnswerDto);
    return await newAnswer.save();
  }

  async findAnswersByIds(list_answer_id: string[]): Promise<any[]> {
    const answers = await this.answerModel
      .find({
        _id: { $in: list_answer_id },
      })
      .exec();

    if (!answers || answers.length === 0) {
      throw new NotFoundException('No answers found for the given IDs');
    }

    return answers;
  }

  // Get all answers
  async getAllAnswers(): Promise<Answer[]> {
    return await this.answerModel.find().exec();
  }

  // Get an answer by ID
  async getAnswerById(answerId: string): Promise<Answer> {
    const answer = await this.answerModel.findById(answerId).exec();
    if (!answer) {
      throw new NotFoundException(`Answer with ID ${answerId} not found`);
    }
    return answer;
  }

  // Update an answer by ID
  async updateAnswer(
    answerId: string,
    updateAnswerDto: UpdateAnswerDto,
  ): Promise<Answer> {
    const checkExistAnswerScore = await this.answerModel.findOne({
      score: updateAnswerDto.score,
    });
    if (checkExistAnswerScore) {
      throw new BadGatewayException('Score already exists');
    }
    const updatedAnswer = await this.answerModel
      .findByIdAndUpdate(answerId, updateAnswerDto, { new: true })
      .exec();
    if (!updatedAnswer) {
      throw new NotFoundException(`Answer with ID ${answerId} not found`);
    }
    return updatedAnswer;
  }

  // Delete a question by ID
  async deleteAnswer(answerId: string): Promise<string> {
    const result = await this.answerModel.findByIdAndDelete(answerId).exec();
    if (!result) {
      throw new NotFoundException(`Answer with ID ${answerId} not found`);
    }
    return `Answer with ID ${answerId} deleted`;
  }
}
