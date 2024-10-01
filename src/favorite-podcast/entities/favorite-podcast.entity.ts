import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { User } from 'src/user/entities/user.entity';

export type PodcastDocument = mongoose.HydratedDocument<FavoritePodcast>;

@Schema({
  timestamps: true,
})
export class FavoritePodcast {
  @ApiProperty({
    description: `User Id`,
    example: 'user_id',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user_id: User;

  @ApiProperty({
    description: `List of favorite podcasts`,
    example: ['podcast_id_1', 'podcast_id_2'],
  })
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Podcast',
    required: true,
  })
  podcast_list_id: Podcast[];
}

export const FavoritePodcastSchema =
  SchemaFactory.createForClass(FavoritePodcast);
