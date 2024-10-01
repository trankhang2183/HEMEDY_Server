import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString, IsEnum, IsString } from 'class-validator';
import { ScheduleSlotEnum } from '../enum/schedule-slot.enum';

export class CreateDoctorScheduleDto {
  @ApiProperty({
    example: '60c72b2f9b1e8a001c8e4f1b',
    description: 'Doctor ID',
  })
  @IsNotEmpty()
  @IsString()
  doctor_id: string;

  @ApiProperty({
    example: '2024-09-30T10:00:00Z',
    description: 'Appointment Date',
  })
  @IsNotEmpty()
  @IsDateString()
  appointment_date: Date;

  @ApiProperty({
    example: ScheduleSlotEnum.SLOT1,
    description: 'Appointment Slot',
  })
  @IsNotEmpty()
  @IsEnum(ScheduleSlotEnum)
  slot: ScheduleSlotEnum;
}
