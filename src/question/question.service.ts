import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<Question>,
  ) {}

  // Create a new question
  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    const newQuestion = new this.questionModel(createQuestionDto);
    return await newQuestion.save();
  }

  // Get all questions
  async getAllQuestions(): Promise<Question[]> {
    return await this.questionModel.find().populate('answer_list_id').exec();
  }

  // Get a question by ID
  async getQuestionById(questionId: string): Promise<Question> {
    const question = await this.questionModel
      .findById(questionId)
      .populate('answer_list_id')
      .exec();
    if (!question) {
      throw new NotFoundException(`Question with ID ${questionId} not found`);
    }
    return question;
  }

  // Update a question by ID
  async updateQuestion(
    questionId: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const updatedQuestion = await this.questionModel
      .findByIdAndUpdate(questionId, updateQuestionDto, { new: true })
      .exec();
    if (!updatedQuestion) {
      throw new NotFoundException(`Question with ID ${questionId} not found`);
    }
    return updatedQuestion;
  }

  // Delete a question by ID
  async deleteQuestion(questionId: string): Promise<string> {
    const result = await this.questionModel
      .findByIdAndDelete(questionId)
      .exec();
    if (!result) {
      throw new NotFoundException(`Question with ID ${questionId} not found`);
    }
    return `Question with ID ${questionId} deleted`;
  }
}
