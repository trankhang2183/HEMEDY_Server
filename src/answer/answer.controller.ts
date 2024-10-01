import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Answer } from './entities/answer.entity';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { RoleEnum } from 'src/role/enum/role.enum';

@ApiTags('Answer')
@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @ApiOperation({
    summary: 'Create a new answer (Admin only)',
  })
  @ApiCreatedResponse({
    description: 'Answer has been successfully created',
    type: Answer,
  })
  @Post()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  createAnswer(@Body() createAnswerDto: CreateAnswerDto): Promise<Answer> {
    return this.answerService.createAnswer(createAnswerDto);
  }

  @ApiOperation({
    summary: 'Get all answers',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all answers',
    type: [Answer],
  })
  @Get()
  getAllAnswers(): Promise<Answer[]> {
    return this.answerService.getAllAnswers();
  }

  @ApiOperation({
    summary: 'Get an answer by ID',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the answer',
    type: Answer,
  })
  @ApiNotFoundResponse({
    description: 'Answer with ID ${answerId} not found',
  })
  @Get(':answerId')
  getAnswerById(@Param('answerId') answerId: string): Promise<Answer> {
    return this.answerService.getAnswerById(answerId);
  }

  @ApiOperation({
    summary: 'Update an answer by ID (Admin only)',
  })
  @ApiOkResponse({
    description: 'Answer has been successfully updated',
    type: Answer,
  })
  @ApiNotFoundResponse({
    description: 'Answer with ID ${answerId} not found',
  })
  @Put(':answerId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  updateAnswer(
    @Param('answerId') answerId: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ): Promise<Answer> {
    return this.answerService.updateAnswer(answerId, updateAnswerDto);
  }
}
