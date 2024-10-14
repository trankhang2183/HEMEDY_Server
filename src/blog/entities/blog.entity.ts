import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type BlogDocument = mongoose.HydratedDocument<Blog>;

@Schema({
  timestamps: true,
})
export class Blog {
  @ApiProperty({
    description: 'Title of the blog',
    example: 'The Future of Technology',
  })
  @Prop()
  title: string;

  @ApiProperty({
    description: 'Type of the blog (e.g., article, tutorial)',
    example: 'article',
  })
  @Prop()
  type: string;

  @ApiProperty({
    description: 'Content of the blog',
    example: 'This blog discusses...',
  })
  @Prop()
  content: string;

  @ApiProperty({
    description: 'Category of the blog',
    example: 'Technology',
  })
  @Prop()
  category: string;

  @ApiProperty({
    description: 'Representative img of the blog',
    example: 'img_url',
  })
  @Prop()
  representative_img: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
