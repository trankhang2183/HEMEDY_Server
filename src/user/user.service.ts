import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User, UserDocument } from './entities/user.entity';
import { RoleEnum } from '../role/enum/role.enum';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Role } from 'src/role/entities/role.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(User.name)
    private readonly roleModel: Model<Role>,

    @InjectModel(Role.name)
    private readonly roleRepository: Model<Role>,
  ) {}

  async getUsers(): Promise<[{ totalUsers: number }, User[]]> {
    try {
      let users = await this.userModel.find().populate('role').exec();

      if (!users || users.length === 0) {
        return [{ totalUsers: 0 }, []];
      }

      const admins = await this.userModel
        .find({
          role_name: RoleEnum.ADMIN,
        })
        .exec();

      const adminEmail: string[] = admins.map((admin) => admin.email);

      users = users.filter(
        (user) => !adminEmail.includes(user.email) && user.role_name,
      );

      const totalUsers = users.length;

      // users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return [{ totalUsers }, users];
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getAllDoctors(): Promise<[{ totalUsers: number }, User[]]> {
    try {
      const users = await this.userModel
        .find({ role_name: RoleEnum.DOCTOR })
        .populate('role')
        .exec();

      if (!users || users.length === 0) {
        return [{ totalUsers: 0 }, []];
      }

      const totalUsers = users.length;

      return [{ totalUsers }, users];
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel
        .findOne({
          email,
        })
        .populate('role')
        .exec();
      if (!user) {
        throw new Error(`Người dùng với email ${email} không tồn tại`);
      }
      return user;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async banAccount(email: string): Promise<User> {
    try {
      const user = await this.userModel
        .findOne({
          email,
        })
        .populate('role')
        .exec();
      if (!user) {
        throw new Error(`Người dùng với email ${email} không tồn tại`);
      }
      if (user.role_name == RoleEnum.ADMIN) {
        throw new Error('Không thể khóa Admin account');
      }
      const result = await this.userModel
        .findByIdAndUpdate(user._id, { is_ban: true }, { new: true })
        .exec();
      if (!result) {
        throw new Error('Có lỗi xảy ra khi khóa tài khoản người dùng');
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async unBanAccount(email: string): Promise<User> {
    try {
      const user = await this.userModel
        .findOne({
          email,
        })
        .populate('role')
        .exec();
      if (!user) {
        throw new Error(`Người dùng với email ${email} không tồn tại`);
      }
      if (user.role_name == RoleEnum.ADMIN) {
        throw new Error('Không thể khóa Admin account');
      }
      if (!user.is_ban) {
        throw new Error('Chỉ có tài khoản đang bị khóa mới cần mở khóa');
      }
      const result = await this.userModel
        .findByIdAndUpdate(user._id, { is_ban: false }, { new: true })
        .exec();
      if (!result) {
        throw new Error('Có lỗi xảy ra khi khóa tài khoản người dùng');
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async searchUserByEmailForAdmin(
    searchEmail: string,
    roleName: RoleEnum,
  ): Promise<User[]> {
    let users: User[] = [];
    try {
      users = await this.userModel
        .find({
          email: { $regex: searchEmail, $options: 'i' },
          role_name: roleName,
        })
        .populate('role')
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Có lỗi xảy ra khi tìm kiếm người dùng với email`,
      );
    }
    return users;
  }

  async updateProfile(
    updateProfileDto: UpdateProfileDto,
    user: User,
  ): Promise<User> {
    try {
      if (updateProfileDto.role_name == RoleEnum.ADMIN) {
        throw new Error('Không thể cập nhật vai trò thành admin');
      }
      const updatedUser = await this.userModel
        .findByIdAndUpdate(user, updateProfileDto, { new: true })
        .exec();
      if (!updatedUser) {
        throw new NotFoundException('Người dùng không tìm thấy');
      }
      if (updateProfileDto.role_name) {
        const role = await this.roleRepository
          .findOne({
            role_name: updateProfileDto.role_name,
          })
          .exec();
        if (role) {
          updatedUser.role = role;
          await updatedUser.save();
        }
      }
      return await this.getUserByEmail(user.email);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async statisticsAccount(): Promise<{ key: string; value: number }[]> {
    try {
      const users: User[] = await this.userModel.find().exec();
      if (!users || users.length === 0) {
        return null;
      }
      const tmpCountData: { [key: string]: number } = {};

      users.forEach((user: User) => {
        const role_name = user.role_name;
        if (role_name) {
          if (!isNaN(tmpCountData[role_name])) {
            tmpCountData[role_name] = tmpCountData[role_name] + 1;
          } else {
            tmpCountData[role_name] = 1;
          }
        }
      });

      const result: { key: string; value: number }[] = Object.keys(
        tmpCountData,
      ).map((key) => ({ key, value: tmpCountData[key] }));
      return result.filter(
        (value) => value.key != 'Admin' && value.key != 'Staff',
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Có lỗi xảy ra khi thống kê tài khoản',
      );
    }
  }
}
