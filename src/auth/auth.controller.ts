import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import GoogleTokenDto from './dto/google-token.dto';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from './get-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtGuard } from './jwt.guard';
import { RolesGuard } from './role.guard';
import { Roles } from './role.decorator';
import { RoleEnum } from 'src/role/enum/role.enum';
import { UpRoleAccountDto } from './dto/upRole-account.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign In with Google to get Access Token' })
  @ApiOkResponse({
    description: 'Access token response',
    schema: {
      properties: {
        access_token: {
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6Ikh1eW5oIER1b25nIiwiZW1haWwiOiJ0cnVuZ2R1b25nMTIyMDI2MTlAZ21haWwuY29tIiwicm9sZSI6IkN1c3RvbWVyIiwiaWF0IjoxNjg5MjM3MjgyLCJleHAiOjE2ODkyNDA4ODJ9.dkUbqCSL5lPEwGvlAJS7cXVXuFiduWNELjXuQZtvShY',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong when creating user.',
  })
  @Post('/google/login')
  async googleLogin(
    @Body() googleTokenDto: GoogleTokenDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.loginGoogleCustomer(googleTokenDto.token);
  }

  @ApiOperation({ summary: 'Sign Up new User' })
  @ApiCreatedResponse({
    description: 'Sign up successfully',
  })
  @ApiBadRequestResponse({
    description: 'Email or Phone has already existed.',
  })
  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<string> {
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({ summary: 'Check email Exist. Return null when not exist' })
  @ApiOkResponse({
    description: 'The User retrieved.',
  })
  @Get('checkEmailExist')
  checkEmailExist(@Query('email') email: string): Promise<User> {
    return this.authService.checkEmailExist(email);
  }

  @ApiOperation({ summary: 'Sign In For Customer to get Access Token' })
  @ApiOkResponse({
    description: 'Access token response',
    schema: {
      properties: {
        access_token: {
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6Ikh1eW5oIER1b25nIiwiZW1haWwiOiJ0cnVuZ2R1b25nMTIyMDI2MTlAZ21haWwuY29tIiwicm9sZSI6IkN1c3RvbWVyIiwiaWF0IjoxNjg5MjM3MjgyLCJleHAiOjE2ODkyNDA4ODJ9.dkUbqCSL5lPEwGvlAJS7cXVXuFiduWNELjXuQZtvShY',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User does not exist.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid password',
  })
  @Post('signInForCustomer')
  signInForCustomer(
    @Body() signInDto: SignInDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signInForCustomer(signInDto);
  }

  @ApiOperation({ summary: 'Sign In For Doctor And Admin to get Access Token' })
  @ApiOkResponse({
    description: 'Access token response',
    schema: {
      properties: {
        access_token: {
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsTmFtZSI6Ikh1eW5oIER1b25nIiwiZW1haWwiOiJ0cnVuZ2R1b25nMTIyMDI2MTlAZ21haWwuY29tIiwicm9sZSI6IkN1c3RvbWVyIiwiaWF0IjoxNjg5MjM3MjgyLCJleHAiOjE2ODkyNDA4ODJ9.dkUbqCSL5lPEwGvlAJS7cXVXuFiduWNELjXuQZtvShY',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User does not exist.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid password',
  })
  @Post('signInForDocAndAdmin')
  signInForDocAndAdmin(
    @Body() signInDto: SignInDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signInForDocAndAdmin(signInDto);
  }

  @ApiOperation({ summary: 'Get All Admin' })
  @Get('all/admin')
  getAllAdmin(): Promise<string[]> {
    return this.authService.getAllAdmin();
  }

  @ApiOperation({ summary: 'User Change Password' })
  @ApiOkResponse({
    description: 'Đổi mật khẩu thành công!',
  })
  @ApiBadRequestResponse({
    description: 'Đổi mật khẩu thành công!',
  })
  @ApiBadRequestResponse({
    description: `Tài khoản của người dùng đang ở trạng thái không hoạt động`,
  })
  @ApiBadRequestResponse({
    description: 'Nhập sai mật khẩu cũ!',
  })
  @ApiBadRequestResponse({
    description: 'Mật khẩu phải tuân thủ theo nguyên tắc',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something when wrong',
  })
  @Patch('changePassword')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() user: User,
  ): Promise<string> {
    return this.authService.changePassword(changePasswordDto, user);
  }

  @ApiOperation({ summary: 'UpRole Account For Doctor By Admin' })
  @ApiOkResponse({
    description: 'UpRole Account Successfully',
    type: User,
  })
  @ApiBadRequestResponse({
    description:
      'Chỉ có Administration mới có quyền nâng cấp vai trò của người dùng',
  })
  @ApiBadRequestResponse({
    description:
      'Không thể nâng cấp vai trò của người dùng thành Administration',
  })
  @ApiBadRequestResponse({
    description: 'Tài khoản của người dùng đang ở trạng thái không hoạt động',
  })
  @ApiInternalServerErrorResponse({
    description: 'Có lỗi xảy ra khi cấp tài khoản cho người dùng',
  })
  @Patch('upRoleDoctor/admin')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtGuard)
  upRoleByAdmin(
    @Body() upRoleAccountDto: UpRoleAccountDto,
    @GetUser() admin: User,
  ): Promise<User> {
    return this.authService.upRoleDoctorByAdmin(upRoleAccountDto, admin);
  }
}
