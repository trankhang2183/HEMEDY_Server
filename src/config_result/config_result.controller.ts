import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ConfigResultService } from './config_result.service';
import { Roles } from 'src/auth/role.decorator';
import { RoleEnum } from 'src/role/enum/role.enum';
import { RolesGuard } from 'src/auth/role.guard';
import { JwtGuard } from 'src/auth/jwt.guard';
import { CreateConfigResultDto } from './dto/create-config_result.dto';
import { UpdateConfigResultDto } from './dto/update-config_result.dto';

@ApiTags('config-results')
@Roles(RoleEnum.ADMIN)
@UseGuards(RolesGuard)
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('config-results')
export class ConfigResultController {
  constructor(private readonly configResultService: ConfigResultService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new config result' })
  @ApiResponse({
    status: 201,
    description: 'The config result has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  createConfigResult(@Body() createConfigResultDto: CreateConfigResultDto) {
    return this.configResultService.createConfigResult(createConfigResultDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all config results' })
  @ApiResponse({ status: 200, description: 'List of config results' })
  getAllConfigResult() {
    return this.configResultService.getAllConfigResult();
  }

  @Get('score/:score')
  @ApiOperation({ summary: 'Get a config result by score' })
  @ApiResponse({ status: 200, description: 'The config result details.' })
  @ApiResponse({ status: 404, description: 'Config result not found.' })
  getConfigResultByScore(@Param('score') score: number) {
    return this.configResultService.getConfigResultByScore(score);
  }

  @Get('min-max-score/:min_score/:max_score')
  @ApiOperation({ summary: 'Get a config result by score' })
  @ApiResponse({ status: 200, description: 'The config result details.' })
  @ApiResponse({ status: 404, description: 'Config result not found.' })
  getConfigResultByMinMaxScore(
    @Param('min_core') min_core: number,
    @Param('max_score') max_score: number,
  ) {
    return this.configResultService.getConfigResultByMinMaxScore(
      min_core,
      max_score,
    );
  }

  @Patch(':min_score/:max_score')
  @ApiOperation({ summary: 'Update a config result by score' })
  @ApiResponse({
    status: 200,
    description: 'The config result has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Config result not found.' })
  updateConfigResultByScore(
    @Param('min_core') min_core: number,
    @Param('max_score') max_score: number,
    @Body() updateConfigResultDto: UpdateConfigResultDto,
  ) {
    return this.configResultService.updateConfigResultByScore(
      min_core,
      max_score,
      updateConfigResultDto,
    );
  }

  @Delete(':score')
  @ApiOperation({ summary: 'Delete a config result by score' })
  @ApiResponse({
    status: 200,
    description: 'The config result has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Config result not found.' })
  removeConfigResult(@Param('score') score: number) {
    return this.configResultService.removeConfigResult(score);
  }
}
