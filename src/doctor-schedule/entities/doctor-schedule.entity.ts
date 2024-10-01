import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { ScheduleSlotEnum } from '../enum/schedule-slot.enum';
import { DoctorScheduleStatus } from '../enum/doctor-schedule-status.enum';
import { User } from 'src/user/entities/user.entity';

export type DoctorScheduleDocument = mongoose.HydratedDocument<DoctorSchedule>;

@Schema({
  timestamps: true,
})
export class DoctorSchedule {
  @ApiProperty({
    description: 'Doctor ID',
    example: '60c72b2f9b1e8a001c8e4f1b',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  doctor_id: User;

  @ApiProperty({
    description: 'Customer ID',
    example: '60c72b2f9b1e8a001c8e4f1c',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  customer_id: User;

  @ApiProperty({
    description: 'Appointment Date',
    example: '2024-09-30T10:00:00Z',
  })
  @Prop({ required: true })
  appointment_date: Date;

  @ApiProperty({
    description: 'Appointment Slot',
    example: ScheduleSlotEnum.SLOT1,
  })
  @Prop({ required: true })
  slot: ScheduleSlotEnum;

  @ApiProperty({
    description: 'Appointment Slot',
    example: DoctorScheduleStatus.PENDING,
  })
  @Prop({ required: true })
  status: DoctorScheduleStatus;
}

export const DoctorScheduleSchema =
  SchemaFactory.createForClass(DoctorSchedule);
