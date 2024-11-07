import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Section } from 'src/section/entities/section.entity';

export type SurveyDocument = mongoose.HydratedDocument<Survey>;

@Schema({
  timestamps: true,
})
export class Survey {
  @ApiProperty({
    description: 'Title of the survey',
    example: 'Customer Satisfaction Survey',
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    description: 'List of sections in the survey',
    example: ['605c72ef9c8b0f1af4aef123', '605c72ef9c8b0f1af4aef124'],
  })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }] })
  section_list_id: Section[];

  @ApiProperty({
    description: 'Is Survey Default',
    example: false,
  })
  @Prop({ required: true, default: false })
  is_default: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const SurveySchema = SchemaFactory.createForClass(Survey);
