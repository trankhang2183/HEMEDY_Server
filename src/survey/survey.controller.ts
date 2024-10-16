import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Put,
} from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Survey } from './entities/survey.entity';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { RoleEnum } from 'src/role/enum/role.enum';
import { UpdateSurveyDto } from './dto/update-survey.dto';

@ApiTags('Survey')
@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @ApiOperation({
    summary: 'Create a new survey (Admin only)',
  })
  @ApiCreatedResponse({
    description: 'Survey has been successfully created',
    type: Survey,
  })
  @Post()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  createSurvey(@Body() createSurveyDto: CreateSurveyDto): Promise<Survey> {
    return this.surveyService.createSurvey(createSurveyDto);
  }

  @ApiOperation({
    summary: 'Get all surveys',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all surveys',
    type: [Survey],
  })
  @Get()
  getAllSurveys(): Promise<Survey[]> {
    return this.surveyService.getAllSurveys();
  }

  @ApiOperation({
    summary: 'Get a survey by ID',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the survey',
    type: Survey,
  })
  @ApiNotFoundResponse({
    description: 'Survey with ID ${surveyId} not found',
  })
  @Get(':surveyId')
  getSurveyById(@Param('surveyId') surveyId: string): Promise<Survey> {
    return this.surveyService.getSurveyById(surveyId);
  }

  @ApiOperation({
    summary: 'Update a Survey by ID (Admin only)',
  })
  @ApiOkResponse({
    description: 'Survey has been successfully updated',
    type: Survey,
  })
  @ApiNotFoundResponse({
    description: 'Survey with ID ${surveyId} not found',
  })
  @Put(':surveyId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  updateSurvey(
    @Param('surveyId') surveyId: string,
    @Body() updateSurveyDto: UpdateSurveyDto,
  ): Promise<Survey> {
    return this.surveyService.updateSurvey(surveyId, updateSurveyDto);
  }

  @ApiOperation({
    summary: 'Update a Survey Default (Admin only)',
  })
  @ApiOkResponse({
    description: 'Survey has been successfully updated',
    type: Survey,
  })
  @ApiNotFoundResponse({
    description: 'Survey with ID ${surveyId} not found',
  })
  @Put('/default/:surveyId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  updateSurveyIsDefault(@Param('surveyId') surveyId: string): Promise<Survey> {
    return this.surveyService.updateSurveyIsDefault(surveyId);
  }

  @ApiOperation({
    summary: 'Delete a survey by ID (Admin only)',
  })
  @ApiOkResponse({
    description: 'Survey has been successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Survey with ID ${surveyId} not found',
  })
  @Delete(':surveyId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  deleteSurvey(@Param('surveyId') surveyId: string): Promise<string> {
    return this.surveyService.deleteSurvey(surveyId);
  }
}
