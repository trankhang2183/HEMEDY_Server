import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type AnswerDocument = mongoose.HydratedDocument<Answer>;

@Schema({
  timestamps: true,
})
export class Answer {
  @ApiProperty({
    description: 'Answer content',
    example: 'This is an answer.',
  })
  @Prop()
  content: string;

  @ApiProperty({
    description: 'Score of the answer',
    example: 10,
  })
  @Prop({ unique: true })
  score: number;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
