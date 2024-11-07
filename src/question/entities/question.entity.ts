import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Answer } from 'src/answer/entities/answer.entity';

export type QuestionDocument = mongoose.HydratedDocument<Question>;

@Schema({
  timestamps: true,
})
export class Question {
  @ApiProperty({
    description: 'Question number',
    example: 1,
  })
  @Prop({ required: true })
  no: number;

  @ApiProperty({
    description: 'Content of the question',
    example: 'What is the capital of France?',
  })
  @Prop({ required: true })
  content: string;

  @ApiProperty({
    description: 'List of associated answers',
    example: '605c72ef9c8b0f1af4aef123',
  })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }] })
  answer_list_id: Answer[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
