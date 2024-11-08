import { Controller, Get, Param, UseGuards } from '@nestjs/common';
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

  @ApiOperation({
    summary: 'Get Statistic Date Sales',
  })
  @Get('statistic-sales/:param')
  statisticSales(@Param('param') param: string): Promise<any> {
    return this.adminService.statisticSales(param);
  }

  @ApiOperation({
    summary: 'Get Statistic Top Services',
  })
  @Get('statistic-top-services')
  statisticTopService(): Promise<any> {
    return this.adminService.statisticTopService();
  }

  @ApiOperation({
    summary: 'Get Statistic Revenue Monthly',
  })
  @Get('statistic-revenue-monthly')
  statisticRevenueForMonth(): Promise<any> {
    return this.adminService.statisticRevenueForMonth();
  }

  @ApiOperation({
    summary: 'Get Statistic Revenue Current Week',
  })
  @Get('statistic-revenue-current-week')
  statisticRevenueForCurrentWeek(): Promise<any> {
    return this.adminService.statisticRevenueForCurrentWeek();
  }

  @ApiOperation({
    summary: 'Get Statistic Domain Monthly',
  })
  @Get('statistic-domain-monthly')
  statisticDomainForMonth(): Promise<any> {
    return this.adminService.statisticDomainForMonth();
  }
}
