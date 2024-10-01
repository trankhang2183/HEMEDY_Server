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
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Section } from './entities/section.entity';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { RoleEnum } from 'src/role/enum/role.enum';

@ApiTags('Section')
@Controller('sections')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @ApiOperation({
    summary: 'Create a new section (Admin only)',
  })
  @ApiCreatedResponse({
    description: 'Section has been successfully created',
    type: Section,
  })
  @Post()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  createSection(@Body() createSectionDto: CreateSectionDto): Promise<Section> {
    return this.sectionService.createSection(createSectionDto);
  }

  @ApiOperation({
    summary: 'Get all sections',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all sections',
    type: [Section],
  })
  @Get()
  getAllSections(): Promise<Section[]> {
    return this.sectionService.getAllSections();
  }

  @ApiOperation({
    summary: 'Get a section by ID',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the section',
    type: Section,
  })
  @ApiNotFoundResponse({
    description: 'Section with ID ${sectionId} not found',
  })
  @Get(':sectionId')
  getSectionById(@Param('sectionId') sectionId: string): Promise<Section> {
    return this.sectionService.getSectionById(sectionId);
  }

  @ApiOperation({
    summary: 'Update a section by ID (Admin only)',
  })
  @ApiOkResponse({
    description: 'Section has been successfully updated',
    type: Section,
  })
  @ApiNotFoundResponse({
    description: 'Section with ID ${sectionId} not found',
  })
  @Put(':sectionId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  updateSection(
    @Param('sectionId') sectionId: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ): Promise<Section> {
    return this.sectionService.updateSection(sectionId, updateSectionDto);
  }

  @ApiOperation({
    summary: 'Delete a section by ID (Admin only)',
  })
  @ApiOkResponse({
    description: 'Section has been successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Section with ID ${sectionId} not found',
  })
  @Delete(':sectionId')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  deleteSection(@Param('sectionId') sectionId: string): Promise<string> {
    return this.sectionService.deleteSection(sectionId);
  }
}
