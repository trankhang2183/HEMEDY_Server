import { Injectable, NotFoundException } from '@nestjs/common';
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
    const newAnswer = new this.answerModel(createAnswerDto);
    return await newAnswer.save();
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
    const updatedAnswer = await this.answerModel
      .findByIdAndUpdate(answerId, updateAnswerDto, { new: true })
      .exec();
    if (!updatedAnswer) {
      throw new NotFoundException(`Answer with ID ${answerId} not found`);
    }
    return updatedAnswer;
  }
}
