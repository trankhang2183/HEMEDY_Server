import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    description: 'Section Id',
    example: 'section_id',
  })
  @IsString()
  @IsNotEmpty()
  section_id: string;

  @ApiProperty({
    description: 'No of the question',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  no: number;

  @ApiProperty({
    description: 'Content of the question',
    example: 'This is an question.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'List of answer IDs for the question',
    example: [
      {
        content: 'Very Satisfied',
        score: 5,
      },
      {
        content: 'Satisfied',
        score: 4,
      },
      {
        content: 'Neutral',
        score: 3,
      },
      {
        content: 'Dissatisfied',
        score: 2,
      },
      {
        content: 'Very Dissatisfied',
        score: 1,
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  answer_list: [
    {
      content: string;
      score: number;
    },
  ];
}
