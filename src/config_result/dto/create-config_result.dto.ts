import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateConfigResultDto {
  @ApiProperty({ example: 85, description: 'Min Score' })
  @IsNotEmpty()
  @IsNumber()
  min_score: number;

  @ApiProperty({ example: 85, description: 'Max Score' })
  @IsNotEmpty()
  @IsNumber()
  max_score: number;

  @ApiProperty({
    example: 'You have a great result!',
    description: 'Result Content',
  })
  @IsNotEmpty()
  @IsString()
  result_content: string;

  @ApiProperty({
    example: 'Keep up the good work and aim for higher goals.',
    description: 'Suggestion',
  })
  @IsNotEmpty()
  @IsString()
  suggestion: string;
}
