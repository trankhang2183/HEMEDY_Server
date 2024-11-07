import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { PodcastTypeEnum } from '../enum/podcast-type.enum';
import { PodcastCategoryEnum } from '../enum/podcast-category.enum';

export type PodcastDocument = mongoose.HydratedDocument<Podcast>;

@Schema({
  timestamps: true,
})
export class Podcast {
  @ApiProperty({
    description: 'Name of the podcast',
    example: 'Tech Talks',
  })
  @Prop()
  name: string;

  @ApiProperty({
    description: 'Link to the podcast audio',
    example: 'https://example.com/audio.mp3',
  })
  @Prop()
  audio_link: string;

  @ApiProperty({
    description: 'Image URL for the podcast',
    example: 'https://example.com/image.jpg',
  })
  @Prop()
  img_url: string;

  @ApiProperty({
    description: 'Author of the podcast',
    example: 'John Doe',
  })
  @Prop()
  author: string;

  @ApiProperty({
    description: 'Type of the podcast (e.g., Technology, Education)',
    example: PodcastTypeEnum.NEW,
  })
  @Prop()
  type: string;

  @ApiProperty({
    description: 'Category of the podcast (e.g., Technology, Education)',
    example: PodcastCategoryEnum.PODCAST,
  })
  @Prop()
  category: string;

  @ApiProperty({
    description: 'Number of listens',
    example: 100,
  })
  @Prop({ default: 0 })
  listen_quantity: number;

  @ApiProperty({
    description: 'Number of favorites',
    example: 50,
  })
  @Prop({ default: 0 })
  favorite_quantity: number;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const PodcastSchema = SchemaFactory.createForClass(Podcast);
