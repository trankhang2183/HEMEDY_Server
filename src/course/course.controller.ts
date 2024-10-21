import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/role.decorator';
import { RoleEnum } from 'src/role/enum/role.enum';
import { RolesGuard } from 'src/auth/role.guard';
import { JwtGuard } from 'src/auth/jwt.guard';
import { GetUser } from 'src/auth/get-user.decorator';

@ApiTags('Course')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiOperation({ summary: 'Create New Course (Customer Only)' })
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @Post()
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @GetUser() user: any,
  ) {
    return this.courseService.createCourse(createCourseDto, user);
  }

  @ApiOperation({ summary: 'Get All Course (Customer Only)' })
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @Get()
  async getAllCourseOfUser(@GetUser() user: any) {
    return this.courseService.getAllCourseOfUser(user);
  }

  @ApiOperation({ summary: 'Get Course By Id (Customer Only)' })
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @Get(':id')
  async getCourseOfUserById(@Param('id') id: string, @GetUser() user: any) {
    return this.courseService.getCourseOfUserById(id, user);
  }

  @ApiOperation({ summary: 'Get All Course (Admin Only)' })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin')
  async getAllCourseForAdmin() {
    return this.courseService.getAllCourseForAdmin();
  }

  @ApiOperation({ summary: 'Get All Course Off User (Admin Only)' })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Get('admin/:user_id')
  async getAllCourseOfUserForAdmin(@Param('user_id') user_id: string) {
    return this.courseService.getAllCourseOfUserForAdmin(user_id);
  }

  @ApiOperation({ summary: 'Delete Course (Admin Only)' })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteCourseByID(@Param('id') id: string) {
    return this.courseService.deleteCourseByID(id);
  }

  @ApiOperation({ summary: 'Delete All Course (Admin Only)' })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @Delete('admin/all')
  async deleteAllCourseByAdmin() {
    return this.courseService.deleteAllCourseByAdmin();
  }
}
