import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Podcast } from './entities/podcast.entity';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { RoleEnum } from 'src/role/enum/role.enum';

@ApiTags('Podcast')
@Controller('podcasts')
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) {}

  @ApiOperation({
    summary: 'Create a new podcast (Admin only)',
  })
  @ApiCreatedResponse({
    description: 'Podcast has been successfully created',
    type: Podcast,
  })
  @Post()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  createPodcast(@Body() createPodcastDto: CreatePodcastDto): Promise<Podcast> {
    return this.podcastService.createPodcast(createPodcastDto);
  }

  @ApiOperation({
    summary: 'Get all podcasts',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all podcasts',
    type: [Podcast],
  })
  @Get()
  getAllPodcasts(): Promise<Podcast[]> {
    return this.podcastService.getAllPodcasts();
  }

  @ApiOperation({
    summary: 'Get a podcast by ID',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the podcast',
    type: Podcast,
  })
  @ApiNotFoundResponse({
    description: 'Podcast with ID ${podcastId} not found',
  })
  @Get(':podcastId')
  getPodcastById(@Param('podcastId') podcastId: string): Promise<Podcast> {
    return this.podcastService.getPodcastById(podcastId);
  }

  @ApiOperation({
    summary: 'Update a podcast by ID (Admin only)',
  })
  @ApiOkResponse({
    description: 'Podcast has been successfully updated',
    type: Podcast,
  })
  @ApiNotFoundResponse({
    description: 'Podcast with ID ${podcastId} not found',
  })
  @Put(':podcastId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  updatePodcast(
    @Param('podcastId') podcastId: string,
    @Body() updatePodcastDto: UpdatePodcastDto,
  ): Promise<Podcast> {
    return this.podcastService.updatePodcast(podcastId, updatePodcastDto);
  }

  @ApiOperation({
    summary: 'Update listen quantity a podcast by ID',
  })
  @ApiOkResponse({
    description: 'Podcast has been successfully updated',
    type: Podcast,
  })
  @ApiNotFoundResponse({
    description: 'Podcast with ID ${podcastId} not found',
  })
  @Put('listen-quantity/:podcastId')
  updateListenQuantityPodcast(
    @Param('podcastId') podcastId: string,
  ): Promise<Podcast> {
    return this.podcastService.updateListenQuantityPodcast(podcastId);
  }

  @ApiOperation({
    summary: 'Update favorite quantity a podcast by ID',
  })
  @ApiOkResponse({
    description: 'Podcast has been successfully updated',
    type: Podcast,
  })
  @ApiNotFoundResponse({
    description: 'Podcast with ID ${podcastId} not found',
  })
  @Put('favorite-quantity/:podcastId')
  updateFavoriteQuantityPodcast(
    @Param('podcastId') podcastId: string,
  ): Promise<Podcast> {
    return this.podcastService.updateFavoriteQuantityPodcast(podcastId);
  }

  @ApiOperation({
    summary: 'Delete a podcast by ID (Admin only)',
  })
  @ApiOkResponse({
    description: 'Podcast has been successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Podcast with ID ${podcastId} not found',
  })
  @Delete(':podcastId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  deletePodcast(@Param('podcastId') podcastId: string): Promise<string> {
    return this.podcastService.deletePodcast(podcastId);
  }
}
