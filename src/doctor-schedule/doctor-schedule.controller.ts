import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { DoctorScheduleService } from './doctor-schedule.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateDoctorScheduleDto } from './dto/create-doctor-schedule.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/auth/role.decorator';
import { RoleEnum } from 'src/role/enum/role.enum';
import { RolesGuard } from 'src/auth/role.guard';

@ApiTags('Doctor Schedules')
@Controller('doctor-schedules')
export class DoctorScheduleController {
  constructor(private readonly doctorScheduleService: DoctorScheduleService) {}

  @Post()
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Create a new doctor schedule' })
  @ApiResponse({
    status: 201,
    description: 'The doctor schedule has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  createNewDoctorSchedule(
    @Body() createDoctorScheduleDto: CreateDoctorScheduleDto,
    @GetUser() user: any,
  ) {
    return this.doctorScheduleService.createNewDoctorSchedule(
      createDoctorScheduleDto,
      user,
    );
  }

  @Get('customer')
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get all schedules of Customer' })
  @ApiResponse({ status: 200, description: 'List of doctor schedules' })
  findAllScheduleOfCustomer(@GetUser() customer: any) {
    return this.doctorScheduleService.findAllScheduleOfCustomer(customer);
  }

  @Get('free-slots/:doctor_id/:date')
  @ApiOperation({ summary: 'Get all schedules of Customer' })
  @ApiResponse({ status: 200, description: 'List of doctor schedules' })
  getAllFreeSlotOfDoctorOfDate(
    @Param('date') date: Date,
    @Param('doctor_id') doctor_id: string,
  ) {
    return this.doctorScheduleService.getAllFreeSlotOfDoctorOfDate(
      date,
      doctor_id,
    );
  }

  @Get('doctor')
  @Roles(RoleEnum.DOCTOR)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get all schedules of Doctor' })
  @ApiResponse({ status: 200, description: 'List of doctor schedules' })
  findAllScheduleOfDoctor(@GetUser() doctor: any) {
    return this.doctorScheduleService.findAllScheduleOfDoctor(doctor);
  }

  @Get('admin/:id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get all schedules of user by admin' })
  @ApiResponse({ status: 200, description: 'List of doctor schedules' })
  findAllScheduleOfUser(@Param('id') id: string) {
    return this.doctorScheduleService.findAllScheduleOfUser(id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Get a doctor schedule by ID' })
  @ApiResponse({ status: 200, description: 'The doctor schedule details.' })
  @ApiResponse({ status: 404, description: 'Doctor schedule not found.' })
  findDoctorScheduleById(@Param('id') id: string) {
    return this.doctorScheduleService.findDoctorScheduleById(id);
  }

  @Patch('/customer/cancel/:id')
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Customer cancel a doctor schedule by ID' })
  @ApiResponse({ status: 200, description: 'The doctor schedule details.' })
  @ApiResponse({
    status: 400,
    description:
      'Schedule must be cancel before 2 hours from appointment time.',
  })
  @ApiResponse({ status: 404, description: 'Doctor schedule not found.' })
  customerCancelSchedule(@GetUser() user: any, @Param('id') id: string) {
    return this.doctorScheduleService.customerCancelSchedule(id, user);
  }

  @Patch('/doctor/complete/:id')
  @Roles(RoleEnum.DOCTOR)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Doctor complete a doctor schedule by ID' })
  @ApiResponse({ status: 200, description: 'The doctor schedule details.' })
  @ApiResponse({
    status: 400,
    description:
      'Schedule must be cancel before 2 hours from appointment time.',
  })
  @ApiResponse({ status: 404, description: 'Doctor schedule not found.' })
  doctorCompleteSchedule(@GetUser() user: any, @Param('id') id: string) {
    return this.doctorScheduleService.doctorCompleteSchedule(id, user);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Delete a doctor schedule by ID (Admin Only)' })
  @ApiResponse({
    status: 200,
    description: 'The doctor schedule has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Doctor schedule not found.' })
  remove(@Param('id') id: string) {
    return this.doctorScheduleService.removeDoctorSchedule(id);
  }
}
