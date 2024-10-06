import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSurveyDto {
  @ApiProperty({
    description: 'Title of the survey',
    example: 'Customer Satisfaction Survey',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
