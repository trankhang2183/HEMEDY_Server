import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Podcast } from './entities/podcast.entity';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { PodcastTypeEnum } from './enum/podcast-type.enum';

@Injectable()
export class PodcastService {
  constructor(
    @InjectModel(Podcast.name)
    private readonly podcastModel: Model<Podcast>,
  ) {}

  // Create a new podcast
  async createPodcast(createPodcastDto: CreatePodcastDto): Promise<Podcast> {
    const newPodcast = new this.podcastModel(createPodcastDto);
    return await newPodcast.save();
  }

  // Get all podcasts
  async getAllPodcasts(): Promise<Podcast[]> {
    return await this.podcastModel.find().exec();
  }

  // Get a podcast by ID
  async getPodcastById(podcastId: string): Promise<Podcast> {
    const podcast = await this.podcastModel.findById(podcastId).exec();
    if (!podcast) {
      throw new NotFoundException(`Podcast with ID ${podcastId} not found`);
    }
    return podcast;
  }

  // Update a podcast by ID
  async updatePodcast(
    podcastId: string,
    updatePodcastDto: UpdatePodcastDto,
  ): Promise<Podcast> {
    const updatedPodcast = await this.podcastModel
      .findByIdAndUpdate(podcastId, updatePodcastDto, { new: true })
      .exec();
    if (!updatedPodcast) {
      throw new NotFoundException(`Podcast with ID ${podcastId} not found`);
    }
    return updatedPodcast;
  }

  // Update listen quantity a podcast by ID
  async updateListenQuantityPodcast(podcastId: string): Promise<Podcast> {
    const podcast = await this.podcastModel.findById(podcastId);
    if (!podcast) {
      throw new NotFoundException(`Podcast with ID ${podcastId} not found`);
    }
    podcast.listen_quantity += 1;
    if (podcast.listen_quantity >= 1000) {
      podcast.type = PodcastTypeEnum.OLD;
    }

    const updatedPodcast = await podcast.save();
    return updatedPodcast;
  }

  // Update listen quantity a podcast by ID
  async updateFavoriteQuantityPodcast(podcastId: string): Promise<Podcast> {
    const podcast = await this.podcastModel.findById(podcastId);
    if (!podcast) {
      throw new NotFoundException(`Podcast with ID ${podcastId} not found`);
    }
    podcast.favorite_quantity += 1;
    const updatedPodcast = await podcast.save();
    return updatedPodcast;
  }

  // Delete a podcast by ID
  async deletePodcast(podcastId: string): Promise<string> {
    const result = await this.podcastModel.findByIdAndDelete(podcastId).exec();
    if (!result) {
      throw new NotFoundException(`Podcast with ID ${podcastId} not found`);
    }
    return `Podcast with ID ${podcastId} deleted`;
  }
}
