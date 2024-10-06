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
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Question } from './entities/question.entity';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { RoleEnum } from 'src/role/enum/role.enum';

@ApiTags('Question')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOperation({
    summary: 'Create a new question (Admin only)',
  })
  @ApiCreatedResponse({
    description: 'Question has been successfully created',
    type: Question,
  })
  @Post()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  createQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    return this.questionService.createQuestion(createQuestionDto);
  }

  @ApiOperation({
    summary: 'Get a question by ID',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the question',
    type: Question,
  })
  @ApiNotFoundResponse({
    description: 'Question with ID ${questionId} not found',
  })
  @Get(':questionId')
  getQuestionById(@Param('questionId') questionId: string): Promise<Question> {
    return this.questionService.getQuestionById(questionId);
  }

  @ApiOperation({
    summary: 'Update a question by ID (Admin only)',
  })
  @ApiOkResponse({
    description: 'Question has been successfully updated',
    type: Question,
  })
  @ApiNotFoundResponse({
    description: 'Question with ID ${questionId} not found',
  })
  @Put(':questionId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  updateQuestion(
    @Param('questionId') questionId: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    return this.questionService.updateQuestion(questionId, updateQuestionDto);
  }

  @ApiOperation({
    summary: 'Delete a question by ID (Admin only)',
  })
  @ApiOkResponse({
    description: 'Question has been successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Question with ID ${questionId} not found',
  })
  @Delete(':questionId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  deleteQuestion(@Param('questionId') questionId: string): Promise<string> {
    return this.questionService.deleteQuestion(questionId);
  }
}
