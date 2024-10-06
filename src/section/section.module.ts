import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Section, SectionSchema } from './entities/section.entity';
import {
  Question,
  QuestionSchema,
} from 'src/question/entities/question.entity';
import { Answer, AnswerSchema } from 'src/answer/entities/answer.entity';
import { Survey } from 'src/survey/entities/survey.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Survey.name, schema: SectionSchema },
      { name: Section.name, schema: SectionSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: Answer.name, schema: AnswerSchema },
    ]),
  ],
  controllers: [SectionController],
  providers: [SectionService],
})
export class SectionModule {}
