import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Survey, SurveySchema } from 'src/survey/entities/survey.entity';
import { Blog, BlogSchema } from 'src/blog/entities/blog.entity';
import {
  Workshop,
  WorkshopSchema,
} from 'src/workshop/entities/workshop.entity';
import { Podcast, PodcastSchema } from 'src/podcast/entities/podcast.entity';
import {
  Transaction,
  TransactionSchema,
} from 'src/transaction/entities/transaction.entity';
import { Course, CourseSchema } from 'src/course/entities/course.entity';
import { User, UserSchema } from 'src/user/entities/user.entity';
import {
  DoctorSchedule,
  DoctorScheduleSchema,
} from 'src/doctor-schedule/entities/doctor-schedule.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Survey.name, schema: SurveySchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Workshop.name, schema: WorkshopSchema },
      { name: Podcast.name, schema: PodcastSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Course.name, schema: CourseSchema },
      { name: User.name, schema: UserSchema },
      { name: DoctorSchedule.name, schema: DoctorScheduleSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
