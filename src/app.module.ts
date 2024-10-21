import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import * as momentTimezone from 'moment-timezone';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModule } from './blog/blog.module';
import { WorkshopModule } from './workshop/workshop.module';
import { PodcastModule } from './podcast/podcast.module';
import { FavoritePodcastModule } from './favorite-podcast/favorite-podcast.module';
import { TransactionModule } from './transaction/transaction.module';
import { SurveyModule } from './survey/survey.module';
import { SectionModule } from './section/section.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { DoctorScheduleModule } from './doctor-schedule/doctor-schedule.module';
import { ResultModule } from './result/result.module';
import { ConfigResultModule } from './config_result/config_result.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './email/email.module';
import { AdminModule } from './admin/admin.module';
import { CourseModule } from './course/course.module';
import { NotificationModule } from './notification/notification.module';
import { SocketGateway } from 'src/utils/socket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"Hemedy" <${config.get('MAIL_FROM')}>`,
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    RoleModule,
    RefreshTokenModule,
    BlogModule,
    WorkshopModule,
    PodcastModule,
    FavoritePodcastModule,
    TransactionModule,
    SurveyModule,
    SectionModule,
    QuestionModule,
    AnswerModule,
    DoctorScheduleModule,
    ResultModule,
    ConfigResultModule,
    EmailModule,
    AdminModule,
    CourseModule,
    NotificationModule,
    SocketGateway,
  ],
})
export class AppModule {
  constructor() {
    // Set default timezone to Vietnam
    momentTimezone.tz.setDefault('Asia/Ho_Chi_Minh');
  }
}
