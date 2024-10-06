import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateQuestionDto {
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
}
