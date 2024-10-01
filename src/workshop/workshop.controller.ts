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
import { WorkshopService } from './workshop.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Workshop } from './entities/workshop.entity';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { RoleEnum } from 'src/role/enum/role.enum';

@ApiTags('Workshop')
@Controller('workshops')
export class WorkshopController {
  constructor(private readonly workshopService: WorkshopService) {}

  @ApiOperation({
    summary: 'Create a new workshop (Admin only)',
  })
  @ApiCreatedResponse({
    description: 'Workshop has been successfully created',
    type: Workshop,
  })
  @Post()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  createWorkshop(
    @Body() createWorkshopDto: CreateWorkshopDto,
  ): Promise<Workshop> {
    return this.workshopService.createWorkshop(createWorkshopDto);
  }

  @ApiOperation({
    summary: 'Get all workshops',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all workshops',
    type: [Workshop],
  })
  @Get()
  getAllWorkshops(): Promise<Workshop[]> {
    return this.workshopService.getAllWorkshops();
  }

  @ApiOperation({
    summary: 'Get a workshop by ID',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the workshop',
    type: Workshop,
  })
  @ApiNotFoundResponse({
    description: 'Workshop with ID ${workshopId} not found',
  })
  @Get(':workshopId')
  getWorkshopById(@Param('workshopId') workshopId: string): Promise<Workshop> {
    return this.workshopService.getWorkshopById(workshopId);
  }

  @ApiOperation({
    summary: 'Update a workshop by ID (Admin only)',
  })
  @ApiOkResponse({
    description: 'Workshop has been successfully updated',
    type: Workshop,
  })
  @ApiNotFoundResponse({
    description: 'Workshop with ID ${workshopId} not found',
  })
  @Put(':workshopId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  updateWorkshop(
    @Param('workshopId') workshopId: string,
    @Body() updateWorkshopDto: UpdateWorkshopDto,
  ): Promise<Workshop> {
    return this.workshopService.updateWorkshop(workshopId, updateWorkshopDto);
  }

  @ApiOperation({
    summary: 'Delete a workshop by ID (Admin only)',
  })
  @ApiOkResponse({
    description: 'Workshop has been successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Workshop with ID ${workshopId} not found',
  })
  @Delete(':workshopId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  deleteWorkshop(@Param('workshopId') workshopId: string): Promise<string> {
    return this.workshopService.deleteWorkshop(workshopId);
  }
}
