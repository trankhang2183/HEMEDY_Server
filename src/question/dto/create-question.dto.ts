import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    description: 'No of the question',
    example: 1,
  })
  @IsString()
  @IsNotEmpty()
  No: string;

  @ApiProperty({
    description: 'Content of the question',
    example: 'This is an question.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
