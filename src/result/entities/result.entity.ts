import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type ResultDocument = mongoose.HydratedDocument<Result>;

@Schema({
  timestamps: true,
})
export class Result {
  @ApiProperty({
    description: 'Result Content',
    example: 'Great job!',
  })
  @Prop({ required: true })
  result_content: string;

  @ApiProperty({
    description: 'Score',
    example: 85,
  })
  @Prop({ required: true })
  score: number;

  @ApiProperty({
    description: 'Suggestion',
    example: 'Keep up the good work!',
  })
  @Prop({ required: true })
  suggestion: string;

  @ApiProperty({
    description: 'User ID (unique)',
    example: '60c72b2f9b1e8a001c8e4f1c',
  })
  @Prop({ required: true, unique: true })
  user_id: mongoose.Types.ObjectId;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
