import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ScheduleExaminationFormEnum } from 'src/doctor-schedule/enum/examination-form.enum';
import { ScheduleSlotEnum } from 'src/doctor-schedule/enum/schedule-slot.enum';

export class PayScheduleTransactionDto {
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

  @ApiProperty({
    description: 'Appointment Examination Form',
    example: ScheduleExaminationFormEnum.OFFLINE,
  })
  @IsNotEmpty()
  @IsEnum(ScheduleExaminationFormEnum)
  examination_form: ScheduleExaminationFormEnum;

  @ApiProperty({
    description: 'Transaction Amount',
    example: 500000,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Product Name',
    example: 'Subscription',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Product Type',
    example: 'Subscription',
  })
  @IsNotEmpty()
  @IsString()
  product_type: string;
}
