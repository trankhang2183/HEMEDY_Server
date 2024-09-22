import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { RoleEnum } from 'src/role/enum/role.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
  ) {}

  async getRoleByRoleName(role_name: RoleEnum): Promise<Role> {
    try {
      const role = await this.roleModel.findOne({ role_name });
      if (!role) {
        throw new NotFoundException(`Role ${role_name} not found`);
      }
      return role;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
