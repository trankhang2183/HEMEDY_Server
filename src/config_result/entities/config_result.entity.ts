import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type ConfigResultDocument = mongoose.HydratedDocument<ConfigResult>;

@Schema({
  timestamps: true,
})
export class ConfigResult {
  @ApiProperty({
    description: 'Min Score',
    example: 85,
  })
  @Prop({ required: true, unique: true })
  min_score: number;

  @ApiProperty({
    description: 'Max Score',
    example: 85,
  })
  @Prop({ required: true, unique: true })
  max_score: number;

  @ApiProperty({
    description: 'Result Content',
    example: 'You have a great result!',
  })
  @Prop({ required: true })
  result_content: string;

  @ApiProperty({
    description: 'Suggestion',
    example: 'Keep up the good work and aim for higher goals.',
  })
  @Prop({ required: true })
  suggestion: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ConfigResultSchema = SchemaFactory.createForClass(ConfigResult);
