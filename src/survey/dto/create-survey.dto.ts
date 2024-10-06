import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

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
    example: [
      {
        no: '1',
        content: 'Customer Service Feedback',
        type: 'Multiple Choice',
        question_list: [
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
      },
      {
        no: '2',
        content: 'Product Quality Feedback',
        type: 'Multiple Choice',
        question_list: [
          {
            no: '1',
            content: 'How satisfied are you with the quality of our products?',
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
        ],
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  section_list: [
    {
      no: string;
      content: string;
      type: string;
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
    },
  ];
}
