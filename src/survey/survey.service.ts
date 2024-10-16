import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Survey } from './entities/survey.entity';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { Section } from 'src/section/entities/section.entity';
import { Question } from 'src/question/entities/question.entity';
import { Answer } from 'src/answer/entities/answer.entity';
import { UpdateSurveyDto } from './dto/update-survey.dto';

@Injectable()
export class SurveyService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
    @InjectModel(Section.name) private readonly sectionModel: Model<Section>,
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    @InjectModel(Answer.name) private readonly answerModel: Model<Answer>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createSurvey(createSurveyDto: CreateSurveyDto): Promise<Survey> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const { title, section_list } = createSurveyDto;

      const sectionDocs = [];
      for (const section of section_list) {
        const questionDocs = [];
        for (const question of section.question_list) {
          const answerDocs = [];
          for (const answer of question.answer_list) {
            const checkExistScore = await this.answerModel
              .findOne({ score: answer.score })
              .session(session);

            if (checkExistScore) {
              answerDocs.push(checkExistScore);
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
            no: question.no,
            content: question.content,
            answer_list_id: answerDocs.map((answer) => answer._id),
          });
          const savedQuestion = await createdQuestion.save({ session });
          questionDocs.push(savedQuestion);
        }

        const createdSection = new this.sectionModel({
          no: section.no,
          content: section.content,
          type: section.type,
          question_list_id: questionDocs.map((question) => question._id),
        });
        const savedSection = await createdSection.save({ session });
        sectionDocs.push(savedSection);
      }

      const createdSurvey = new this.surveyModel({
        title,
        section_list_id: sectionDocs.map((section) => section._id),
      });

      await createdSurvey.save({ session });

      await session.commitTransaction();
      return createdSurvey;
    } catch (error) {
      await session.abortTransaction();
      console.error('Transaction failed:', error);
      throw new InternalServerErrorException(
        'Transaction failed and was rolled back',
        error.message,
      );
    } finally {
      session.endSession();
    }
  }

  async getAllSurveys(): Promise<Survey[]> {
    return await this.surveyModel
      .find()
      .populate({
        path: 'section_list_id',
        populate: {
          path: 'question_list_id',
          populate: {
            path: 'answer_list_id',
          },
        },
      })
      .exec();
  }

  async getSurveyById(surveyId: string): Promise<Survey> {
    const survey = await this.surveyModel
      .findById(surveyId)
      .populate({
        path: 'section_list_id',
        populate: {
          path: 'question_list_id',
          populate: {
            path: 'answer_list_id',
          },
        },
      })
      .exec();
    if (!survey) {
      throw new NotFoundException(`Survey with ID ${surveyId} not found`);
    }
    return survey;
  }

  async updateSurvey(
    surveyId: string,
    updateSurveyDto: UpdateSurveyDto,
  ): Promise<Survey> {
    const updatedSurvey = await this.surveyModel
      .findByIdAndUpdate(surveyId, updateSurveyDto, { new: true })
      .exec();
    if (!updatedSurvey) {
      throw new NotFoundException(`Survey with ID ${surveyId} not found`);
    }
    return updatedSurvey;
  }

  async updateSurveyIsDefault(surveyId: string): Promise<Survey> {
    const survey = await this.surveyModel.findById(surveyId);
    if (!survey) {
      throw new NotFoundException(`Survey ${surveyId} not found`);
    }

    // updat others survey to false
    await this.surveyModel.updateMany(
      { _id: { $ne: surveyId } },
      { $set: { is_default: false } },
    );

    survey.is_default = true;
    const updatedSurvey = await survey.save();
    return updatedSurvey;
  }

  async deleteSurvey(surveyId: string): Promise<string> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const survey = await this.surveyModel.findById(surveyId).session(session);
      if (!survey) {
        throw new NotFoundException(`Survey with ID ${surveyId} not found`);
      }

      const questionIds = [];
      for (const sectionId of survey.section_list_id) {
        const section = await this.sectionModel
          .findByIdAndDelete(sectionId)
          .session(session);
        if (section) {
          questionIds.push(...section.question_list_id);
        }
      }

      const answerIds = [];
      for (const questionId of questionIds) {
        const question = await this.questionModel
          .findByIdAndDelete(questionId)
          .session(session);
        if (question) {
          answerIds.push(...question.answer_list_id);
        }
      }

      await this.answerModel
        .deleteMany({ _id: { $in: answerIds } })
        .session(session);

      await this.surveyModel.findByIdAndDelete(surveyId).session(session);

      await session.commitTransaction();
      return `Survey with ID ${surveyId} and all related data deleted successfully`;
    } catch (error) {
      await session.abortTransaction();
      console.error('Delete survey transaction failed:', error);
      throw new InternalServerErrorException(
        'Failed to delete survey and related data',
        error.message,
      );
    } finally {
      session.endSession();
    }
  }
}
