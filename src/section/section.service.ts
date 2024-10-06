import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Section } from './entities/section.entity';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Question } from 'src/question/entities/question.entity';
import { Answer } from 'src/answer/entities/answer.entity';
import { Survey } from 'src/survey/entities/survey.entity';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
    @InjectModel(Section.name) private readonly sectionModel: Model<Section>,
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    @InjectModel(Answer.name) private readonly answerModel: Model<Answer>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createSection(createSectionDto: CreateSectionDto): Promise<Section> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const { survey_id, no, content, type, question_list } = createSectionDto;

      const survey = await this.surveyModel
        .findById(survey_id)
        .session(session);
      if (!survey) {
        throw new NotFoundException('Survey not found');
      }

      const questionDocs = [];
      for (const question of question_list) {
        const answerDocs = [];
        for (const answer of question.answer_list) {
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
          no: question.no,
          content: question.content,
          answer_list_id: answerDocs.map((answer) => answer._id),
        });
        const savedQuestion = await createdQuestion.save({ session });
        questionDocs.push(savedQuestion);
      }

      const createdSection = new this.sectionModel({
        no,
        content,
        type,
        question_list_id: questionDocs.map((question) => question._id),
      });

      const savedSection = await createdSection.save({ session });

      survey.section_list_id.push(savedSection);
      await survey.save({ session });

      await session.commitTransaction();
      return savedSection;
    } catch (error) {
      await session.abortTransaction();
      console.error('Create section transaction failed:', error);
      throw new InternalServerErrorException(
        'Transaction failed and was rolled back',
        error.message,
      );
    } finally {
      session.endSession();
    }
  }

  async getSectionById(sectionId: string): Promise<Section> {
    const section = await this.sectionModel
      .findById(sectionId)
      .populate({
        path: 'question_list_id',
        populate: {
          path: 'answer_list_id',
        },
      })
      .exec();
    if (!section) {
      throw new NotFoundException(`Section with ID ${sectionId} not found`);
    }
    return section;
  }

  async updateSection(
    sectionId: string,
    updateSectionDto: UpdateSectionDto,
  ): Promise<Section> {
    const updatedSection = await this.sectionModel
      .findByIdAndUpdate(sectionId, updateSectionDto, { new: true })
      .exec();
    if (!updatedSection) {
      throw new NotFoundException(`Section with ID ${sectionId} not found`);
    }
    return updatedSection;
  }

  async deleteSection(sectionId: string): Promise<string> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const section = await this.sectionModel
        .findById(sectionId)
        .session(session);
      if (!section) {
        throw new NotFoundException(`Section with ID ${sectionId} not found`);
      }

      const answerIds = [];
      for (const questionId of section.question_list_id) {
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

      await this.sectionModel.findByIdAndDelete(sectionId).session(session);

      await this.surveyModel
        .updateMany(
          { section_list_id: sectionId },
          { $pull: { section_list_id: sectionId } },
        )
        .session(session);

      await session.commitTransaction();
      return `Section with ID ${sectionId} and all related data deleted successfully`;
    } catch (error) {
      await session.abortTransaction();
      console.error('Delete section transaction failed:', error);
      throw new InternalServerErrorException(
        'Failed to delete section and related data',
        error.message,
      );
    } finally {
      session.endSession();
    }
  }
}
