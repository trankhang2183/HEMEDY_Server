import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { FavoritePodcastService } from './favorite-podcast.service';
import { CreateFavoritePodcastDto } from './dto/create-favorite-podcast.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { FavoritePodcast } from './entities/favorite-podcast.entity';

@ApiTags('Favorite Podcast')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('favorite-podcast')
export class FavoritePodcastController {
  constructor(
    private readonly favoritePodcastService: FavoritePodcastService,
  ) {}

  @ApiOperation({ summary: 'Add a podcast to Favorite' })
  @ApiResponse({
    status: 201,
    description: 'The favorite podcast has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post()
  async addNewPodcastToFavorite(
    @Body() createFavoritePodcastDto: CreateFavoritePodcastDto,
    @GetUser() user: any,
  ): Promise<FavoritePodcast> {
    return this.favoritePodcastService.addNewPodcastToFavorite(
      createFavoritePodcastDto,
      user,
    );
  }

  @ApiOperation({ summary: 'Get user favorite podcast' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched the favorite podcast.',
  })
  @ApiResponse({ status: 404, description: 'Favorite podcast not found.' })
  @Get()
  async getUserFavoritePodcast(@GetUser() user: any) {
    return this.favoritePodcastService.getUserFavoritePodcast(user);
  }

  @ApiOperation({ summary: 'Remove a favorite podcast from favorite' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the favorite podcast.',
  })
  @ApiResponse({ status: 404, description: 'Favorite podcast not found.' })
  @Patch()
  async removePodcastFromFavorite(
    @Body() createFavoritePodcastDto: CreateFavoritePodcastDto,
    @GetUser() user: any,
  ) {
    return this.favoritePodcastService.removePodcastFromFavorite(
      createFavoritePodcastDto,
      user,
    );
  }
}
