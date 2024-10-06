import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateSectionDto {
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
}
