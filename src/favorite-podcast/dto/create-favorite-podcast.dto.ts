import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFavoritePodcastDto {
  @ApiProperty({
    description: `Podcast Id`,
    example: 'podcast_id',
  })
  @IsNotEmpty()
  @IsString()
  podcast_id: string;
}
