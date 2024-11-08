import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { PayloadJwtDto } from './dto/payload-jwt.dto';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/role/entities/role.entity';
import { jwtDecode } from 'jwt-decode';
import { RoleEnum } from 'src/role/enum/role.enum';
import { UserService } from 'src/user/user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpRoleAccountDto } from './dto/upRole-account.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DomainModel } from './entities/domain.entity';
import { DomainEnum } from './enum/domain.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userRepository: Model<User>,

    @InjectModel(Role.name)
    private readonly roleRepository: Model<Role>,

    @InjectModel(DomainModel.name)
    private readonly domainRepository: Model<DomainModel>,

    private readonly jwtService: JwtService,

    private readonly userService: UserService,
  ) {}

  async loginGoogleCustomer(token: string): Promise<{ accessToken: string }> {
    const googlePayload: any = jwtDecode(token);
    try {
      const user = await this.userRepository
        .findOne({
          email: googlePayload.email,
          role_name: RoleEnum.CUSTOMER,
        })
        .populate('role');
      if (user) {
        if (user.is_ban) {
          throw new BadRequestException(
            'Tài khoản của bạn đã bị khóa. Hãy liên hệ với admin để mở khóa!',
          );
        }
        const payload: PayloadJwtDto = {
          fullname: user.fullname,
          email: user.email,
          status: user.status,
          role_name: user.role_name,
          avatar_url: user.avatar_url,
          isNewUser: false,
        };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
      } else {
        const role: Role = await this.roleRepository.findOne({
          role_name: RoleEnum.CUSTOMER,
        });

        const user = await this.userRepository.create({
          email: googlePayload.email,
          fullname: googlePayload.name,
          avatar_url: googlePayload.picture,
          role_name: RoleEnum.CUSTOMER,
          role: role,
          status: true,
        });
        if (!user) {
          throw new BadRequestException(
            'Có lỗi xảy ra khi tạo người dùng mới. Vui lòng kiểm tra lại thông tin',
          );
        }

        const payload: PayloadJwtDto = {
          fullname: user.fullname,
          email: user.email,
          status: user.status,
          role_name: user.role_name,
          avatar_url: user.avatar_url,
          isNewUser: true,
        };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async loginGoogleDocAndAdmin(
    token: string,
  ): Promise<{ accessToken: string }> {
    const googlePayload: any = jwtDecode(token);
    const roleList: RoleEnum[] = [RoleEnum.ADMIN, RoleEnum.DOCTOR];

    try {
      const user = await this.userRepository
        .findOne({
          email: googlePayload.email,
          role_name: { $in: roleList },
        })
        .populate('role')
        .exec();

      if (user) {
        if (user.is_ban) {
          throw new BadRequestException(
            'Tài khoản của bạn đã bị khóa. Hãy liên hệ với admin để mở khóa!',
          );
        }

        const payload: PayloadJwtDto = {
          fullname: user.fullname,
          email: user.email,
          status: user.status,
          role_name: user.role_name,
          avatar_url: user.avatar_url,
          isNewUser: false,
        };

        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
      } else {
        throw new NotFoundException('Tài khoản không tồn tại');
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async signUp(signUpDto: SignUpDto): Promise<string> {
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,}$/;

    if (!PASSWORD_REGEX.test(signUpDto.password)) {
      throw new BadRequestException('Mật khẩu phải tuân thủ theo nguyên tắc');
    }

    try {
      const isExist = await this.userRepository.findOne({
        email: signUpDto.email,
      });
      if (isExist) {
        throw new BadRequestException(
          `Người dùng với email ${signUpDto.email} đã tồn tại trong hệ thống`,
        );
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const newUser = new this.userRepository({
      ...signUpDto,
      status: true,
    });

    // Gán vai trò mặc định cho người dùng
    const role = await this.roleRepository.findOne({
      role_name: RoleEnum.CUSTOMER,
    });
    newUser.role = role;
    newUser.role_name = RoleEnum.CUSTOMER;

    try {
      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt();
      newUser.password = await bcrypt.hash(signUpDto.password, salt);

      // Lưu người dùng vào cơ sở dữ liệu
      await newUser.save();
      return 'Đăng ký thành công!';
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email đã được sử dụng!');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async checkEmailExist(email: string): Promise<User> {
    try {
      const user: User = await this.userRepository
        .findOne({
          email,
        })
        .populate('role')
        .exec();
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async signInForCustomer(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string }> {
    let user: User = null;
    try {
      user = await this.userRepository
        .findOne({
          email: signInDto.email,
          role_name: RoleEnum.CUSTOMER,
        })
        .populate('role')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!user) {
      throw new NotFoundException(
        `Người dùng với email ${signInDto.email} không tồn tại!`,
      );
    }
    if (user.is_ban) {
      throw new BadRequestException(
        'Tài khoản của bạn đã bị khóa. Hãy liên hệ với admin để mở khóa!',
      );
    }
    try {
      const checkPassword = await bcrypt.compare(
        signInDto.password,
        user.password,
      );
      if (!checkPassword) {
        throw new Error('Sai mật khẩu!');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    const payload: PayloadJwtDto = {
      fullname: user.fullname,
      email: user.email,
      status: user.status,
      role_name: user.role_name,
      avatar_url: user.avatar_url,
      isNewUser: false,
    };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async signInForDocAndAdmin(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string }> {
    let user: User = null;
    const roleList: RoleEnum[] = [RoleEnum.ADMIN, RoleEnum.DOCTOR];
    try {
      user = await this.userRepository
        .findOne({ email: signInDto.email, role_name: { $in: roleList } })
        .populate('role')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (!user) {
      throw new NotFoundException(
        `Người dùng với email ${signInDto.email} không tồn tại!`,
      );
    }
    if (user.is_ban) {
      throw new BadRequestException(
        'Tài khoản của bạn đã bị khóa. Hãy liên hệ với admin để mở khóa!',
      );
    }
    try {
      const checkPassword = await bcrypt.compare(
        signInDto.password,
        user.password,
      );
      if (!checkPassword) {
        throw new Error('Sai mật khẩu!');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    const payload: PayloadJwtDto = {
      fullname: user.fullname,
      email: user.email,
      status: user.status,
      role_name: user.role_name,
      avatar_url: user.avatar_url,
      isNewUser: false,
    };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async handleVerifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload['email'];
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    user: User,
  ): Promise<string> {
    if (!user.status) {
      throw new BadRequestException(
        `Tài khoản của người dùng đang ở trạng thái không hoạt động`,
      );
    }
    try {
      const checkPassword = await bcrypt.compare(
        changePasswordDto.oldPassword,
        user.password,
      );
      if (!checkPassword) {
        throw new BadRequestException('Nhập sai mật khẩu cũ!');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,}$/;
    if (!PASSWORD_REGEX.test(changePasswordDto.newPassword)) {
      throw new BadRequestException('Mật khẩu phải tuân thủ theo nguyên tắc');
    }
    try {
      const salt = await bcrypt.genSalt();
      const newPassword = await bcrypt.hash(
        changePasswordDto.newPassword,
        salt,
      );

      await this.userRepository
        .findByIdAndUpdate(user, { password: newPassword }, { new: true })
        .exec();
      return 'Đổi mật khẩu thành công!';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllAdmin(): Promise<string[]> {
    try {
      const admins = await this.userRepository.find({
        role_name: RoleEnum.ADMIN,
      });
      return admins.map((admin) => admin.email);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async upRoleDoctorByAdmin(
    upRoleAccountDto: UpRoleAccountDto,
    admin: User,
  ): Promise<User> {
    if (admin.role.role_name !== RoleEnum.ADMIN) {
      throw new BadRequestException(
        'Chỉ có Administration mới có quyền nâng cấp vai trò của người dùng',
      );
    }

    const user: User = await this.userService.getUserByEmail(
      upRoleAccountDto.email,
    );

    if (!user.status) {
      throw new BadRequestException(
        'Tài khoản của người dùng đang ở trạng thái không hoạt động',
      );
    }

    const role: Role = await this.roleRepository.findOne({
      role_name: RoleEnum.DOCTOR,
    });

    user.role = role;
    user.role_name = RoleEnum.DOCTOR;

    try {
      const result: User = await this.userRepository.findByIdAndUpdate(
        user,
        { role: user.role, role_name: user.role_name },
        { new: true },
      );

      if (!result) {
        throw new InternalServerErrorException(
          'Có lỗi xảy ra khi nâng cấp vai trò cho người dùng',
        );
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async increaseQuantityUserVisit(): Promise<DomainModel> {
    let domain = await this.domainRepository.findOne();
    if (!domain) {
      domain = new this.domainRepository();
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    let isExist = false;
    switch (currentMonth) {
      case 9: {
        domain.Sep = domain.Sep.map((Sep) => {
          if (Sep.type === DomainEnum.VISIT) {
            isExist = true;
            return { ...Sep, quantity: Sep.quantity + 1 };
          }
          return Sep;
        });

        if (!isExist) {
          domain.Sep.push({
            type: DomainEnum.VISIT,
            quantity: 1,
          });
        }

        await domain.save();
        return domain;
        break;
      }
      case 10: {
        domain.Oct = domain.Oct.map((Oct) => {
          if (Oct.type === DomainEnum.VISIT) {
            isExist = true;
            return { ...Oct, quantity: Oct.quantity + 1 };
          }
          return Oct;
        });

        if (!isExist) {
          domain.Sep.push({
            type: DomainEnum.VISIT,
            quantity: 1,
          });
        }

        await domain.save();
        return domain;
        break;
      }
      case 11: {
        domain.Nov = domain.Nov.map((Nov) => {
          if (Nov.type === DomainEnum.VISIT) {
            isExist = true;
            return { ...Nov, quantity: Nov.quantity + 1 };
          }
          return Nov;
        });

        if (!isExist) {
          domain.Nov.push({
            type: DomainEnum.VISIT,
            quantity: 1,
          });
        }

        await domain.save();
        return domain;
        break;
      }
      case 12: {
        domain.Dec = domain.Dec.map((Dec) => {
          if (Dec.type === DomainEnum.VISIT) {
            isExist = true;
            return { ...Dec, quantity: Dec.quantity + 1 };
          }
          return Dec;
        });

        if (!isExist) {
          domain.Dec.push({
            type: DomainEnum.VISIT,
            quantity: 1,
          });
        }

        await domain.save();
        return domain;
        break;
      }
    }
  }

  async increaseQuantityListenMusic(): Promise<DomainModel> {
    let domain = await this.domainRepository.findOne();
    if (!domain) {
      domain = new this.domainRepository();
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    let isExist = false;
    switch (currentMonth) {
      case 9: {
        domain.Sep = domain.Sep.map((Sep) => {
          if (Sep.type === DomainEnum.MUSIC) {
            isExist = true;
            return { ...Sep, quantity: Sep.quantity + 1 };
          }
          return Sep;
        });

        if (!isExist) {
          domain.Sep.push({
            type: DomainEnum.MUSIC,
            quantity: 1,
          });
        }

        await domain.save();
        return domain;
        break;
      }
      case 10: {
        domain.Oct = domain.Oct.map((Oct) => {
          if (Oct.type === DomainEnum.MUSIC) {
            isExist = true;
            return { ...Oct, quantity: Oct.quantity + 1 };
          }
          return Oct;
        });

        if (!isExist) {
          domain.Sep.push({
            type: DomainEnum.MUSIC,
            quantity: 1,
          });
        }

        await domain.save();
        return domain;
        break;
      }
      case 11: {
        domain.Nov = domain.Nov.map((Nov) => {
          if (Nov.type === DomainEnum.MUSIC) {
            isExist = true;
            return { ...Nov, quantity: Nov.quantity + 1 };
          }
          return Nov;
        });

        if (!isExist) {
          domain.Nov.push({
            type: DomainEnum.MUSIC,
            quantity: 1,
          });
        }

        await domain.save();
        return domain;
        break;
      }
      case 12: {
        domain.Dec = domain.Dec.map((Dec) => {
          if (Dec.type === DomainEnum.MUSIC) {
            isExist = true;
            return { ...Dec, quantity: Dec.quantity + 1 };
          }
          return Dec;
        });

        if (!isExist) {
          domain.Dec.push({
            type: DomainEnum.MUSIC,
            quantity: 1,
          });
        }

        await domain.save();
        return domain;
        break;
      }
    }
  }

  async increaseQuantityListenPodcast(): Promise<DomainModel> {
    let domain = await this.domainRepository.findOne();
    if (!domain) {
      domain = new this.domainRepository();
    }
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    let isExist = false;
    switch (currentMonth) {
      case 9: {
        domain.Sep = domain.Sep.map((Sep) => {
          if (Sep.type === DomainEnum.PODCAST) {
            isExist = true;
            return { ...Sep, quantity: Sep.quantity + 1 };
          }
          return Sep;
        });

        if (!isExist) {
          domain.Sep.push({
            type: DomainEnum.PODCAST,
            quantity: 1,
          });
        }

        await domain.save();
        return domain;
        break;
      }
      case 10: {
        domain.Oct = domain.Oct.map((Oct) => {
          if (Oct.type === DomainEnum.PODCAST) {
            isExist = true;
            return { ...Oct, quantity: Oct.quantity + 1 };
          }
          return Oct;
        });

        if (!isExist) {
          domain.Sep.push({
            type: DomainEnum.PODCAST,
            quantity: 1,
          });
        }

        await domain.save();
        return domain;
        break;
      }
      case 11: {
        domain.Nov = domain.Nov.map((Nov) => {
          if (Nov.type === DomainEnum.PODCAST) {
            isExist = true;
            return { ...Nov, quantity: Nov.quantity + 1 };
          }
          return Nov;
        });

        if (!isExist) {
          domain.Nov.push({
            type: DomainEnum.PODCAST,
            quantity: 1,
          });
        }

        await domain.save();
        return domain;
        break;
      }
      case 12: {
        domain.Dec = domain.Dec.map((Dec) => {
          if (Dec.type === DomainEnum.PODCAST) {
            isExist = true;
            return { ...Dec, quantity: Dec.quantity + 1 };
          }
          return Dec;
        });

        if (!isExist) {
          domain.Dec.push({
            type: DomainEnum.PODCAST,
            quantity: 1,
          });
        }

        await domain.save();
        return domain;
        break;
      }
    }
  }

  async increaseQuantityTakeSurvey(): Promise<DomainModel> {
    let domain = await this.domainRepository.findOne();
    if (!domain) {
      domain = new this.domainRepository();
    }
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    let isExist = false;
    switch (currentMonth) {
      case 9: {
        domain.Sep = domain.Sep.map((Sep) => {
          if (Sep.type === DomainEnum.SURVEY) {
            isExist = true;
            return { ...Sep, quantity: Sep.quantity + 1 };
          }
          return Sep;
        });

        if (!isExist) {
          domain.Sep.push({
            type: DomainEnum.SURVEY,
            quantity: 1,
          });
        }

        await domain.save();
        return domain;
        break;
      }
      case 10: {
        domain.Oct = domain.Oct.map((Oct) => {
          if (Oct.type === DomainEnum.SURVEY) {
            isExist = true;
            return { ...Oct, quantity: Oct.quantity + 1 };
          }
          return Oct;
        });

        if (!isExist) {
          domain.Sep.push({
            type: DomainEnum.SURVEY,
            quantity: 1,
          });
        }

        await domain.save();
        return domain;
        break;
      }
      case 11: {
        domain.Nov = domain.Nov.map((Nov) => {
          if (Nov.type === DomainEnum.SURVEY) {
            isExist = true;
            return { ...Nov, quantity: Nov.quantity + 1 };
          }
          return Nov;
        });

        if (!isExist) {
          domain.Nov.push({
            type: DomainEnum.SURVEY,
            quantity: 1,
          });
        }

        await domain.save();
        return domain;
        break;
      }
      case 12: {
        domain.Dec = domain.Dec.map((Dec) => {
          if (Dec.type === DomainEnum.SURVEY) {
            isExist = true;
            return { ...Dec, quantity: Dec.quantity + 1 };
          }
          return Dec;
        });

        if (!isExist) {
          domain.Dec.push({
            type: DomainEnum.SURVEY,
            quantity: 1,
          });
        }

        await domain.save();
        return domain;
        break;
      }
    }
  }
}
