import { Module } from '@nestjs/common';
import { NewMessageService } from './new-message.service';
import { NewMessageController } from './new-message.controller';
import { NewMessage, NewMessageSchema } from './entities/new-message.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NewMessage.name, schema: NewMessageSchema },
    ]),
  ],
  controllers: [NewMessageController],
  providers: [NewMessageService],
})
export class NewMessageModule {}
