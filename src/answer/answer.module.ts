import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Answer, AnswerSchema } from './entities/answer.entity';

@Module({
  controllers: [AnswerController],
  imports: [
    MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }]),
  ],
  providers: [AnswerService],
})
export class AnswerModule {}
