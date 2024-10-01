import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Title of the blog',
    example: 'The Future of Technology',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Type of the blog (e.g., article, tutorial)',
    example: 'article',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Content of the blog',
    example: 'This blog discusses...',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Category of the blog',
    example: 'Technology',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  category: string;
}
