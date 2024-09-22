import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export type RoleDocument = mongoose.HydratedDocument<Role>;

@Schema({
  timestamps: true,
})
export class Role {
  @ApiProperty({
    description: 'Role Name',
    example: 1,
  })
  @Prop()
  role_name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
