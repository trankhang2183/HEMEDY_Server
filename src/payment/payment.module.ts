import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from 'src/notification/notification.service';
import {
  Notification,
  NotificationSchema,
} from 'src/notification/entities/notification.entity';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { Role, RoleSchema } from 'src/role/entities/role.entity';
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
  controllers: [PaymentController],
  providers: [
    PaymentService,
    ConfigService,
    NotificationService,
    UserService,
    EmailService,
    JwtService,
  ],
})
export class PaymentModule {}
