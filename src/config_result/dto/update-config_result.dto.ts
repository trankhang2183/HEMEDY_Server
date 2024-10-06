import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateConfigResultDto {
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
