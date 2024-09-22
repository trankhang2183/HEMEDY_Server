import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NotificationTypeEnum } from '../enum/notification-type.enum';
import { User } from 'src/user/entities/user.entity';
import mongoose from 'mongoose';

export type NotificationDocument = mongoose.HydratedDocument<Notification>;

@Schema({
  timestamps: true,
})
export class Notification {
  @Prop()
  notification_type: NotificationTypeEnum;

  @Prop()
  information: string;

  @Prop({ nullable: true })
  note: number;

  @Prop({ default: true })
  is_new: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  receiver: User;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
