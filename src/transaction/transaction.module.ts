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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: DoctorSchedule.name, schema: DoctorScheduleSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, ConfigService, UserService, EmailService],
})
export class TransactionModule {}
