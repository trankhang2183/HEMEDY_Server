import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Question } from 'src/question/entities/question.entity';

export type SectionDocument = mongoose.HydratedDocument<Section>;

@Schema({
  timestamps: true,
})
export class Section {
  @ApiProperty({
    description: 'Section number',
    example: 1,
  })
  @Prop({ required: true })
  no: number;

  @ApiProperty({
    description: 'Content of the section',
    example: 'This is the content of section 1.',
  })
  @Prop({ required: true })
  content: string;

  @ApiProperty({
    description: 'Type of the section',
    example: 'Multiple Choice',
  })
  @Prop({ required: true })
  type: string;

  @ApiProperty({
    description: 'List of questions associated with the section',
    example: ['605c72ef9c8b0f1af4aef123', '605c72ef9c8b0f1af4aef124'],
  })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }] })
  question_list_id: Question[];
}

export const SectionSchema = SchemaFactory.createForClass(Section);
