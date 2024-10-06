import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Section } from 'src/section/entities/section.entity';
import { Answer } from 'src/answer/entities/answer.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Section.name) private readonly sectionModel: Model<Section>,
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    @InjectModel(Answer.name) private readonly answerModel: Model<Answer>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const { section_id, no, content, answer_list } = createQuestionDto;

      const section = await this.sectionModel
        .findById(section_id)
        .session(session);
      if (!section) {
        throw new NotFoundException('Section not found');
      }

      const answerDocs = [];
      for (const answer of answer_list) {
        const checkExistAnswer = await this.answerModel
          .findOne({ score: answer.score })
          .session(session);
        if (checkExistAnswer) {
          answerDocs.push(checkExistAnswer);
        } else {
          const createdAnswer = new this.answerModel({
            content: answer.content,
            score: answer.score,
          });
          const savedAnswer = await createdAnswer.save({ session });
          answerDocs.push(savedAnswer);
        }
      }

      const createdQuestion = new this.questionModel({
        no,
        content,
        answer_list_id: answerDocs.map((answer) => answer._id),
      });
      const savedQuestion = await createdQuestion.save({ session });

      section.question_list_id.push(savedQuestion);
      await section.save({ session });

      await session.commitTransaction();
      return savedQuestion;
    } catch (error) {
      await session.abortTransaction();
      console.error('Create question transaction failed:', error);
      throw new InternalServerErrorException(
        'Transaction failed and was rolled back',
        error.message,
      );
    } finally {
      session.endSession();
    }
  }

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

  async deleteQuestion(questionId: string): Promise<string> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const question = await this.questionModel
        .findById(questionId)
        .session(session);
      if (!question) {
        throw new NotFoundException(`Question with ID ${questionId} not found`);
      }

      await this.answerModel
        .deleteMany({ _id: { $in: question.answer_list_id } })
        .session(session);

      await this.questionModel.findByIdAndDelete(questionId).session(session);

      await this.sectionModel
        .updateMany(
          { question_list_id: questionId },
          { $pull: { question_list_id: questionId } },
        )
        .session(session);

      await session.commitTransaction();
      return `Question with ID ${questionId} and all related answers deleted successfully`;
    } catch (error) {
      await session.abortTransaction();
      console.error('Delete question transaction failed:', error);
      throw new InternalServerErrorException(
        'Failed to delete question and related data',
        error.message,
      );
    } finally {
      session.endSession();
    }
  }
}
