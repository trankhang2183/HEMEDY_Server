import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFavoritePodcastDto } from './dto/create-favorite-podcast.dto';
import { FavoritePodcast } from './entities/favorite-podcast.entity';
import { Podcast } from 'src/podcast/entities/podcast.entity';

@Injectable()
export class FavoritePodcastService {
  constructor(
    @InjectModel(FavoritePodcast.name)
    private readonly favoritePodcastModel: Model<FavoritePodcast>,

    @InjectModel(Podcast.name)
    private readonly podcastModel: Model<Podcast>,
  ) {}

  // Create a new favorite podcast
  async addNewPodcastToFavorite(
    createFavoritePodcastDto: CreateFavoritePodcastDto,
    user: any,
  ): Promise<FavoritePodcast> {
    const podcast = await this.podcastModel
      .findById(createFavoritePodcastDto.podcast_id)
      .exec();
    if (!podcast) {
      throw new NotFoundException(`Podcast not found`);
    }
    const checkExist = await this.favoritePodcastModel.findOne({
      user_id: user._id,
    });
    if (!checkExist) {
      const newFavoritePodcast = new this.favoritePodcastModel({
        user_id: user._id,
        podcast_list_id: [podcast],
      });
      return await newFavoritePodcast.save();
    } else {
      checkExist.podcast_list_id.push(podcast);
      await checkExist.save();
      return checkExist;
    }
  }

  // Find one favorite podcast by ID
  async getUserFavoritePodcast(user: any): Promise<FavoritePodcast> {
    const favoritePodcast = await this.favoritePodcastModel
      .findOne({ user_id: user._id })
      .populate('podcast_list_id')
      .exec();
    if (!favoritePodcast) {
      throw new NotFoundException(`User have no Favorite Podcast`);
    }
    return favoritePodcast;
  }

  // Delete a favorite podcast
  async removePodcastFromFavorite(
    createFavoritePodcastDto: CreateFavoritePodcastDto,
    user: any,
  ): Promise<FavoritePodcast> {
    const podcast = await this.podcastModel
      .findById(createFavoritePodcastDto.podcast_id)
      .exec();
    if (!podcast) {
      throw new NotFoundException(`Podcast not found`);
    }
    const favoritePodcast = await this.favoritePodcastModel.findOne({
      user_id: user._id,
    });
    favoritePodcast.podcast_list_id = favoritePodcast.podcast_list_id.filter(
      (item) => item.toString() !== podcast._id.toString(),
    );
    await favoritePodcast.save();
    return favoritePodcast;
  }
}
