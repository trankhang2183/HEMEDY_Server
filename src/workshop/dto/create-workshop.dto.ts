import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkshopDto {
  @ApiProperty({
    description: 'Title of the workshop',
    example: 'The Future of Technology',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Type of the workshop (e.g., article, tutorial)',
    example: 'article',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Content of the workshop',
    example: 'This workshop discusses...',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Category of the workshop',
    example: 'Technology',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  category: string;
}