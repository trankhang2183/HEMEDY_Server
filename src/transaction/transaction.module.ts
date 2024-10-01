import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { Role, RoleSchema } from 'src/role/entities/role.entity';
import {
  Notification,
  NotificationSchema,
} from 'src/notification/entities/notification.entity';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';
import { Transaction, TransactionSchema } from './entities/transaction.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    ConfigService,
    NotificationService,
    UserService,
  ],
})
export class TransactionModule {}
