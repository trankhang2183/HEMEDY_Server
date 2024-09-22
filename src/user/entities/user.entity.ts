import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/role/entities/role.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @ApiProperty({
    description: 'Username of User',
    example: 'Example',
    required: false,
  })
  @Prop()
  fullname: string;

  @ApiProperty({
    description: 'Avatar URL of User',
    example:
      'https://www.vivosmartphone.vn/uploads/MANGOADS/ch%E1%BB%A5p%20%E1%BA%A3nh/ki%E1%BB%83u%20ch%E1%BB%A5p%20%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20cho%20n%E1%BB%AF/kieu%20chup%20hinh%20dep%20cho%20nu%202.jpg',
    required: false,
  })
  @Prop({ required: false })
  avatar_url: string;

  @ApiProperty({
    description: 'Date of Birth of User',
    example: '2001-02-22',
    required: false,
  })
  @Prop({ required: false })
  dob: Date;

  @ApiProperty({
    description: 'Gender of User',
    example: 'Male',
    required: false,
  })
  @Prop({ required: false })
  gender: string;

  @ApiProperty({
    description: 'Address of User',
    example: 'Ho Chi Minh',
    required: false,
  })
  @Prop({ required: false })
  address: string;

  @ApiProperty({
    description: 'Address Detail of User',
    example: 'Số 123, khu phố 4',
    required: false,
  })
  @Prop({ required: false })
  address_detail: string;

  @ApiProperty({
    description: 'Phone Number of User',
    example: '0838462852',
    required: false,
  })
  @Prop({ required: false })
  phone_number: string;

  @ApiProperty({
    description: 'Email of User',
    example: 'example@gmail.com',
    required: false,
  })
  @Prop({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Password of User',
    example: '123456',
    required: false,
  })
  @Prop({ required: false })
  password: string;

  @ApiProperty({
    description: 'specialized field',
    example: 'Friendly',
    required: false,
  })
  @Prop({ required: false })
  specialized_field: string;

  @ApiProperty({
    description: 'specialty ',
    example: 'Friendly',
    required: false,
  })
  @Prop({ required: false })
  specialty: string;

  @ApiProperty({
    description: 'treatment method',
    example: 'Friendly',
    required: false,
  })
  @Prop({ required: false })
  treatment_method: string;

  @ApiProperty({
    description: 'experience',
    example: 'Friendly',
    required: false,
  })
  @Prop({ required: false })
  experience: string;

  @ApiProperty({
    description: 'certificate',
    example: 'Friendly',
    required: false,
  })
  @Prop({ required: false })
  certificate: string;

  @ApiProperty({
    description: 'career',
    example: 'Abc',
    required: false,
  })
  @Prop({ required: false })
  career: string;

  @ApiProperty({
    description: 'otherInformation',
    example: 'Abc',
    required: false,
  })
  @Prop({ required: false })
  otherInformation: string;

  @ApiProperty({
    description: 'Status of account',
    example: 'true',
    default: false,
  })
  @Prop({ default: false })
  status: boolean;

  @ApiProperty({
    description: 'Is Account Banned',
    example: false,
    default: false,
  })
  @Prop({ default: false })
  is_ban: boolean;

  @ApiProperty({
    description: 'Role Name of User',
    example: 'Admin',
  })
  @Prop({ required: false })
  role_name: string;

  @ApiProperty({
    description: 'Role of User',
    example: 'Admin',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
