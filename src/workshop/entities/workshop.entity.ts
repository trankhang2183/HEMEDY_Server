import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type WorkshopDocument = mongoose.HydratedDocument<Workshop>;

@Schema({
  timestamps: true,
})
export class Workshop {
  @ApiProperty({
    description: 'Title of the workshop',
    example: 'Web Development Workshop',
  })
  @Prop()
  title: string;

  @ApiProperty({
    description: 'Sub Title of the workshop',
    example: 'Web development',
  })
  @Prop()
  subtitle: string;

  @ApiProperty({
    description: 'Type of the workshop (e.g., tutorial, seminar)',
    example: 'tutorial',
  })
  @Prop()
  type: string;

  @ApiProperty({
    description: 'Content of the workshop',
    example: 'This workshop covers...',
  })
  @Prop()
  content: string;

  @ApiProperty({
    description: 'Representative img of the blog',
    example: 'img_url',
  })
  @Prop()
  representative_img: string;
}

export const WorkshopSchema = SchemaFactory.createForClass(Workshop);
