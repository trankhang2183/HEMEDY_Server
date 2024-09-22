import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type NewMessageDocument = mongoose.HydratedDocument<NewMessage>;

@Schema({
  timestamps: true,
})
export class NewMessage {
  @Prop()
  userId: number;

  @Prop()
  identifierUserChat: string;

  @Prop({ default: true })
  isNew: boolean;
}

export const NewMessageSchema = SchemaFactory.createForClass(NewMessage);
