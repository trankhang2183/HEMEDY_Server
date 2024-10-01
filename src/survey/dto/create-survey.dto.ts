import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateSurveyDto {
  @ApiProperty({
    description: 'Title of the survey',
    example: 'Customer Satisfaction Survey',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'List of section IDs for the survey',
    example: ['605c72ef9c8b0f1af4aef123', '605c72ef9c8b0f1af4aef124'],
  })
  @IsArray()
  @IsNotEmpty()
  section_list_id: Types.ObjectId[];
}
