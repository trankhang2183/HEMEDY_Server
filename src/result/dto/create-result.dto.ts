import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, IsMongoId } from 'class-validator';

export class CreateResultDto {
  @ApiProperty({
    example: ['60c72b2f9b1e8a001c8e4f1c'],
    description: 'List of answer IDs',
  })
  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  list_answer_id: string[];
}
