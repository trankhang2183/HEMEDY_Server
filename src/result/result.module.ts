import { Module } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Result, ResultSchema } from './entities/result.entity';
import { ConfigResultService } from 'src/config_result/config_result.service';
import { AnswerService } from 'src/answer/answer.service';
import {
  ConfigResult,
  ConfigResultSchema,
} from 'src/config_result/entities/config_result.entity';
import { Answer, AnswerSchema } from 'src/answer/entities/answer.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Result.name, schema: ResultSchema },
      { name: ConfigResult.name, schema: ConfigResultSchema },
      { name: Answer.name, schema: AnswerSchema },
    ]),
  ],
  controllers: [ResultController],
  providers: [ResultService, ConfigResultService, AnswerService],
})
export class ResultModule {}
