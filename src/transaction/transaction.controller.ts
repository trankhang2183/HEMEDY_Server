import { PayScheduleAccountBalanceTransactionDto } from './dto/pay-schedule-account-balance-transaction.dto';
import { PayScheduleStripeTransactionDto } from './dto/pay-schedule-stripe-transaction.dto';
import { PayProductAccountBalanceTransactionDto } from './dto/pay-product-account-balance-transaction.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Roles } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/role.guard';
import { RoleEnum } from 'src/role/enum/role.enum';
import { JwtGuard } from 'src/auth/jwt.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { TransactionService } from './transaction.service';
import { AddFundTransactionDto } from './dto/add-funds-transaction.dto';
import { PayProductTransactionDto } from './dto/pay-product-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { PayProductStripeTransactionDto } from './dto/pay-product-stripe-transaction.dto';
import { PayScheduleTransactionDto } from './dto/pay-schedule-momo-transaction.dto';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({ summary: 'Get all transaction of user' })
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get()
  getAllTransactionOfUser(@GetUser() user: any): Promise<Transaction[]> {
    return this.transactionService.getAllTransactionOfUser(user);
  }

  @ApiOperation({ summary: 'Get all transaction of user by Admin' })
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('admin')
  getAllTransactionByAdmin(): Promise<Transaction[]> {
    return this.transactionService.getAllTransactionByAdmin();
  }

  @ApiOperation({ summary: 'Get all courses of user' })
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('all-courses')
  getAllCoursesOfUser(@GetUser() user: any): Promise<Transaction[]> {
    return this.transactionService.getAllCoursesOfUser(user);
  }

  @ApiOperation({ summary: 'Add Funds By Stripe' })
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('/stripe/addFunds')
  addFundsByStripe(
    @Body() addFundTransactionDto: AddFundTransactionDto,
    @GetUser() user: any,
  ): Promise<string> {
    return this.transactionService.addFundsByStripe(
      addFundTransactionDto,
      user,
    );
  }

  @ApiOperation({ summary: 'Pay Product By Stripe' })
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('/stripe/payProduct')
  payProductByStripe(
    @Body() payProductStripeTransactionDto: PayProductStripeTransactionDto,
    @GetUser() user: any,
  ): Promise<string> {
    return this.transactionService.payProductByStripe(
      payProductStripeTransactionDto,
      user,
    );
  }

  @ApiOperation({ summary: 'Pay Schedule By Stripe' })
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('/stripe/paySchedule')
  payForScheduleByStripe(
    @Body() payScheduleStripeTransactionDto: PayScheduleStripeTransactionDto,
    @GetUser() user: any,
  ): Promise<string> {
    return this.transactionService.payForScheduleByStripe(
      payScheduleStripeTransactionDto,
      user,
    );
  }

  @ApiOperation({ summary: 'Stripe Payment Callback' })
  @Get('/stripe/paymentCallback')
  async paymentStripeCallback(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    const result = await this.transactionService.paymentStripeCallback(
      request.query,
    );
    response.redirect(result.redirectUrl);
  }

  @ApiOperation({ summary: 'Add Funds By MoMo' })
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('/MoMo/addFunds')
  addFundsByMoMo(
    @Body() addFundTransactionDto: AddFundTransactionDto,
    @GetUser() user: any,
  ): Promise<string> {
    return this.transactionService.addFundsByMoMo(addFundTransactionDto, user);
  }

  @ApiOperation({ summary: 'Pay Product By MoMo' })
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('/MoMo/payProduct')
  payProductByMoMo(
    @Body() payProductTransactionDto: PayProductTransactionDto,
    @GetUser() user: any,
  ): Promise<string> {
    return this.transactionService.payProductByMoMo(
      payProductTransactionDto,
      user,
    );
  }

  @ApiOperation({ summary: 'Pay Schedule By MoMo' })
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('/MoMo/paySchedule')
  payForScheduleByMoMo(
    @Body() payScheduleTransactionDto: PayScheduleTransactionDto,
    @GetUser() user: any,
  ): Promise<string> {
    return this.transactionService.payForScheduleByMoMo(
      payScheduleTransactionDto,
      user,
    );
  }

  @ApiOperation({ summary: 'MoMo Payment Callback' })
  @Get('/MoMo/paymentCallback')
  async paymentMoMoCallback(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    const result = await this.transactionService.paymentMoMoCallback(
      request.query,
    );
    response.redirect(result.redirectUrl);
  }

  @ApiOperation({ summary: 'Add Funds By VnPay' })
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('/vnPay/addFunds')
  addFundsByVNPay(
    @Body() addFundTransactionDto: AddFundTransactionDto,
    @Req() request: Request,
    @GetUser() user: User,
  ): Promise<string> {
    return this.transactionService.addFundsByVNPay(
      addFundTransactionDto,
      user,
      request,
    );
  }

  @ApiOperation({ summary: 'Pay Product By VnPay' })
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('/vnPay/payProduct')
  payProductByVNPay(
    @Body() payProductTransactionDto: PayProductTransactionDto,
    @Req() request: Request,
    @GetUser() user: User,
  ): Promise<string> {
    return this.transactionService.payProductByVNPay(
      payProductTransactionDto,
      user,
      request,
    );
  }

  @ApiOperation({ summary: 'Pay Schedule By VnPay' })
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('/vnPay/paySchedule')
  payForScheduleByVNPay(
    @Body() payScheduleTransactionDto: PayScheduleTransactionDto,
    @Req() request: Request,
    @GetUser() user: User,
  ): Promise<string> {
    return this.transactionService.payForScheduleByVNPay(
      payScheduleTransactionDto,
      user,
      request,
    );
  }

  @ApiOperation({ summary: 'VnPay Payment Callback' })
  @Get('/vnPay/paymentCallback')
  async paymentVnPayCallback(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<any> {
    const result = await this.transactionService.paymentVnPayCallback(
      request.query,
    );
    response.redirect(result.redirectUrl);
  }

  @ApiOperation({ summary: 'Pay Product By Account Balance' })
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('/accountBalance/payProduct')
  async payProductByAccountBalance(
    @Body()
    payProductAccountBalanceTransactionDto: PayProductAccountBalanceTransactionDto,
    @Res() response: Response,
    @GetUser() user: User,
  ): Promise<any> {
    const result = await this.transactionService.payProductByAccountBalance(
      user,
      payProductAccountBalanceTransactionDto,
    );
    response.redirect(result.redirectUrl);
  }

  @ApiOperation({ summary: 'Pay Schedule By Account Balance' })
  @Roles(RoleEnum.CUSTOMER)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('/accountBalance/paySchedule')
  async payForScheduleByAccountBalance(
    @Body()
    payScheduleAccountBalanceTransactionDto: PayScheduleAccountBalanceTransactionDto,
    @Res() response: Response,
    @GetUser() user: User,
  ): Promise<any> {
    const result = await this.transactionService.payForScheduleByAccountBalance(
      user,
      payScheduleAccountBalanceTransactionDto,
    );
    response.redirect(result.redirectUrl);
  }
}
