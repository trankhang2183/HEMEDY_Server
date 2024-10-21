import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { Role, RoleSchema } from 'src/role/entities/role.entity';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { Transaction, TransactionSchema } from './entities/transaction.entity';
import {
  DoctorSchedule,
  DoctorScheduleSchema,
} from 'src/doctor-schedule/entities/doctor-schedule.entity';
import { EmailService } from 'src/email/email.service';
import { Course, CourseSchema } from 'src/course/entities/course.entity';
import { NotificationService } from 'src/notification/notification.service';
import {
  Notification,
  NotificationSchema,
} from 'src/notification/entities/notification.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: DoctorSchedule.name, schema: DoctorScheduleSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    ConfigService,
    UserService,
    EmailService,
    NotificationService,
  ],
})
export class TransactionModule {}
