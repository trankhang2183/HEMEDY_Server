import { Controller, Get, Patch, Param, UseGuards, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtGuard } from 'src/auth/jwt.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { RoleEnum } from '../role/enum/role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get Users' })
  @ApiOkResponse({
    description: 'The user has been successfully retrieved.',
    type: [User],
  })
  @ApiNotFoundResponse({
    description: 'Have no User in the repository.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
  })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get()
  getAllUsers(): Promise<[{ totalUsers: number }, User[]]> {
    return this.userService.getUsers();
  }

  @ApiOperation({ summary: 'Get Doctors' })
  @ApiOkResponse({
    description: 'The user has been successfully retrieved.',
    type: [User],
  })
  @ApiNotFoundResponse({
    description: 'Have no User in the repository.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
  })
  @Get('all/doctors')
  getAllDoctors(): Promise<[{ totalUsers: number }, User[]]> {
    return this.userService.getAllDoctors();
  }

  @ApiOperation({ summary: 'Get a user by email' })
  @ApiOkResponse({
    description: 'The user has been successfully retrieved.',
    type: [User],
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
  })
  @Get('doctor/:id')
  getDoctorById(@Param('id') id: string): Promise<User> {
    return this.userService.getDoctorById(id);
  }

  @ApiOperation({ summary: 'Get a user by email' })
  @ApiOkResponse({
    description: 'The user has been successfully retrieved.',
    type: [User],
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get(':email')
  getUserByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.getUserByEmail(email);
  }

  @ApiOperation({ summary: 'Search user who have email contain searchEmail' })
  @ApiOkResponse({
    description: 'The list user has been successfully retrieved.',
    type: [User],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
  })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('/searchUserForAdmin/:searchEmail/:roleName')
  searchUserByEmailForAdmin(
    @Param('searchEmail') searchEmail?: string,
    @Param('roleName') roleName?: RoleEnum,
  ): Promise<User[]> {
    return this.userService.searchUserByEmailForAdmin(searchEmail, roleName);
  }

  @ApiOperation({ summary: 'Change User Name' })
  @ApiOkResponse({
    description: 'UserName has been changed',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @ApiBadRequestResponse({
    description: 'User status is false.',
  })
  @ApiBadRequestResponse({
    description: 'UserName is not following regex pattern.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch('update-profile')
  updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @GetUser() user: User,
  ): Promise<User> {
    return this.userService.updateProfile(updateProfileDto, user);
  }

  @ApiOperation({ summary: 'Ban Account' })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch('banAccount/:email')
  banAccount(@Param('email') email: string): Promise<User> {
    return this.userService.banAccount(email);
  }

  @ApiOperation({ summary: 'UnBan Account' })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch('unBanAccount/:email')
  unBanAccount(@Param('email') email: string): Promise<User> {
    return this.userService.unBanAccount(email);
  }

  // @ApiOperation({ summary: 'Delete Account' })
  // @Roles(RoleEnum.ADMIN)
  // @UseGuards(RolesGuard)
  // @ApiBearerAuth()
  // @UseGuards(JwtGuard)
  // @Delete('deleteAccount/:email')
  // deleteAccount(@Param('email') email: string): Promise<User> {
  //   return null;
  // }

  @ApiOperation({ summary: 'Admin Statistics Account' })
  @ApiOkResponse({
    description: 'The list user has been successfully retrieved.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Có lỗi xảy ra khi thống kê tài khoản',
  })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('/admin/statisticsAccount')
  statisticsAccount(): Promise<{ key: string; value: number }[]> {
    return this.userService.statisticsAccount();
  }
}
