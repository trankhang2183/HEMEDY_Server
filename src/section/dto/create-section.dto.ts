import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({
    description: 'Survey ID',
    example: 'Survey ID',
  })
  @IsNotEmpty()
  @IsString()
  survey_id: string;

  @ApiProperty({
    description: 'Section number',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  no: number;

  @ApiProperty({
    description: 'Content of the section',
    example: 'This is the content of section 1.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Type of the section',
    example: 'Multiple Choice',
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: 'List of question IDs for the section',
    example: [
      {
        no: '1',
        content: 'How satisfied are you with our customer service?',
        answer_list: [
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
      },
      {
        no: '2',
        content: 'How would you rate the professionalism of our staff?',
        answer_list: [
          {
            content: 'Excellent',
            score: 5,
          },
          {
            content: 'Good',
            score: 4,
          },
          {
            content: 'Average',
            score: 3,
          },
          {
            content: 'Below Average',
            score: 2,
          },
          {
            content: 'Poor',
            score: 1,
          },
        ],
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  question_list: [
    {
      no: string;
      content: string;
      answer_list: [
        {
          content: string;
          score: number;
        },
      ];
    },
  ];
}
