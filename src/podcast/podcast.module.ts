import { Module } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastController } from './podcast.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Podcast, PodcastSchema } from './entities/podcast.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Podcast.name, schema: PodcastSchema }]),
  ],
  controllers: [PodcastController],
  providers: [PodcastService],
})
export class PodcastModule {}
