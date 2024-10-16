import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/role.decorator';
import { RoleEnum } from 'src/role/enum/role.enum';
import { RolesGuard } from 'src/auth/role.guard';
import { JwtGuard } from 'src/auth/jwt.guard';

@ApiTags('Admin')
@Roles(RoleEnum.ADMIN)
@UseGuards(RolesGuard)
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({
    summary: 'Get Statistic For Admin',
  })
  @Get()
  createPodcast(): Promise<any> {
    return this.adminService.statisticForAdmin();
  }
}
