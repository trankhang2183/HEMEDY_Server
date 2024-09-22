import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type MessageDocument = mongoose.HydratedDocument<Message>;

@Schema({
  timestamps: true,
})
export class Message {
  @Prop()
  text: string;

  @Prop()
  name: string;

  @Prop()
  avatar: string;

  @Prop()
  senderEmail: string;

  @Prop()
  identifierUserChat: string;

  @Prop()
  groupId: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
