import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ResultService } from './result.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateResultDto } from './dto/create-result.dto';
import { Roles } from 'src/auth/role.decorator';
import { RoleEnum } from 'src/role/enum/role.enum';
import { RolesGuard } from 'src/auth/role.guard';
import { JwtGuard } from 'src/auth/jwt.guard';
import { GetUser } from 'src/auth/get-user.decorator';

@ApiTags('results')
@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post()
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Create a new result (Customer Only)' })
  @ApiResponse({
    status: 201,
    description: 'The result has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or result already exists.',
  })
  createResult(@Body() createResultDto: CreateResultDto, @GetUser() user: any) {
    return this.resultService.createResult(createResultDto, user);
  }

  @Get()
  @Roles(RoleEnum.ADMIN, RoleEnum.DOCTOR)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get all results (Admin and Doctor)' })
  @ApiResponse({ status: 200, description: 'List of results' })
  getAllResults() {
    return this.resultService.getAllResults();
  }

  @Get('/of-user')
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get results of user (Customer Only)' })
  @ApiResponse({ status: 200, description: 'Result' })
  getResultOfUser(@GetUser() user: any) {
    return this.resultService.getResultOfUser(user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get a result by ID (Admin and Doctor)' })
  @ApiResponse({ status: 200, description: 'The result details.' })
  @ApiResponse({ status: 404, description: 'Result not found.' })
  getResultByUserId(@Param('id') id: string) {
    return this.resultService.getResultById(id);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Delete a result by ID' })
  @ApiResponse({
    status: 200,
    description: 'The result has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Result not found.' })
  removeResult(@Param('id') id: string) {
    return this.resultService.removeResult(id);
  }
}
