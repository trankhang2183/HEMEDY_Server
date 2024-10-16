import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorScheduleService } from './doctor-schedule.service';
import { DoctorScheduleController } from './doctor-schedule.controller';
import {
  DoctorSchedule,
  DoctorScheduleSchema,
} from './entities/doctor-schedule.entity';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DoctorSchedule.name, schema: DoctorScheduleSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [DoctorScheduleController],
  providers: [DoctorScheduleService, EmailService],
})
export class DoctorScheduleModule {}
