import { NotificationController } from './notification.controller';
import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  Notification,
  NotificationSchema,
} from './entities/notification.entity';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

import { Role, RoleSchema } from 'src/role/entities/role.entity';
import { RoleService } from 'src/role/role.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [
    RoleService,
    NotificationService,
    UserService,
    ConfigService,
    EmailService,
    JwtService,
  ],
})
export class NotificationModule {}
