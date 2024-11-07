import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: true })
export class Course extends Document {
  @ApiProperty({
    description: 'User ID',
    example: '60c72b2f9b1e8a001c8e4f1c',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user_id: User;

  @ApiProperty({
    description: 'Product Type Of Course',
    example: 'Example Course',
    nullable: false,
  })
  @Prop({ unique: true, required: true })
  product_type: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
