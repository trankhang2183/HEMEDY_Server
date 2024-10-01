import { Module } from '@nestjs/common';
import { FavoritePodcastService } from './favorite-podcast.service';
import { FavoritePodcastController } from './favorite-podcast.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FavoritePodcast,
  FavoritePodcastSchema,
} from './entities/favorite-podcast.entity';
import { Podcast, PodcastSchema } from 'src/podcast/entities/podcast.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FavoritePodcast.name, schema: FavoritePodcastSchema },
      { name: Podcast.name, schema: PodcastSchema },
    ]),
  ],
  controllers: [FavoritePodcastController],
  providers: [FavoritePodcastService],
})
export class FavoritePodcastModule {}
