import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Survey, SurveySchema } from './entities/survey.entity';
import { Section, SectionSchema } from 'src/section/entities/section.entity';
import {
  Question,
  QuestionSchema,
} from 'src/question/entities/question.entity';
import { Answer, AnswerSchema } from 'src/answer/entities/answer.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Survey.name, schema: SurveySchema },
      { name: Section.name, schema: SectionSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: Answer.name, schema: AnswerSchema },
    ]),
  ],
  controllers: [SurveyController],
  providers: [SurveyService],
})
export class SurveyModule {}
