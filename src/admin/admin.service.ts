import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from 'src/blog/entities/blog.entity';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { PodcastCategoryEnum } from 'src/podcast/enum/podcast-category.enum';
import { Survey } from 'src/survey/entities/survey.entity';
import { Workshop } from 'src/workshop/entities/workshop.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Survey.name) private readonly surveyModel: Model<Survey>,
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
    @InjectModel(Workshop.name) private readonly workshopModel: Model<Workshop>,
    @InjectModel(Podcast.name) private readonly podcastModel: Model<Podcast>,
  ) {}

  async statisticForAdmin(): Promise<any> {
    const result = {
      blog: await this.blogModel.countDocuments(),
      workshop: await this.workshopModel.countDocuments(),
      podcast_podcast: await this.podcastModel.countDocuments({
        category: PodcastCategoryEnum.PODCAST,
      }),
      podcast_music: await this.podcastModel.countDocuments({
        category: PodcastCategoryEnum.MUSIC,
      }),
      survey: await this.surveyModel.countDocuments(),
    };

    return result;
  }
}
