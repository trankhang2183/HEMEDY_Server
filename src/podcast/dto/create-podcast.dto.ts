import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { PodcastTypeEnum } from '../enum/podcast-type.enum';
import { PodcastCategoryEnum } from '../enum/podcast-category.enum';

export class CreatePodcastDto {
  @ApiProperty({
    description: 'Name of the podcast',
    example: 'Tech Talks',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Link to the podcast audio',
    example: 'https://example.com/audio.mp3',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  audio_link: string;

  @ApiProperty({
    description: 'Image URL for the podcast',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  img_url: string;

  @ApiProperty({
    description: 'Author of the podcast',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    description: 'Type of the podcast',
    example: PodcastTypeEnum.NEW,
  })
  @IsEnum(PodcastTypeEnum)
  @IsNotEmpty()
  type: PodcastTypeEnum;

  @ApiProperty({
    description: 'Category of the podcast',
    example: PodcastCategoryEnum.PODCAST,
  })
  @IsEnum(PodcastCategoryEnum)
  @IsNotEmpty()
  category: PodcastCategoryEnum;
}
