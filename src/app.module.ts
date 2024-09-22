import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { NotificationModule } from './notification/notification.module';
import * as momentTimezone from 'moment-timezone';
import { ScheduleModule } from '@nestjs/schedule';
import { MessageModule } from './message/message.module';
import { NewMessageModule } from './new-message/new-message.module';
import { SocketGateway } from 'socket.gateway';
import { PaymentModule } from './payment/payment.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
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
          from: `"Kho dự án Truyền thông" <${config.get('MAIL_FROM')}>`,
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    RoleModule,
    EmailModule,
    RefreshTokenModule,
    NotificationModule,
    MessageModule,
    NewMessageModule,
    PaymentModule,
  ],
  providers: [SocketGateway],
})
export class AppModule {
  constructor() {
    // Set default timezone to Vietnam
    momentTimezone.tz.setDefault('Asia/Ho_Chi_Minh');
  }
}
