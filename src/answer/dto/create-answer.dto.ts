import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateAnswerDto {
  @ApiProperty({
    description: 'Content of the answer',
    example: 'This is an answer.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Score of the answer',
    example: 10,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  score: number;
}
