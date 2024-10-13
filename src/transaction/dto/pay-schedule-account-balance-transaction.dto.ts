import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ScheduleSlotEnum } from 'src/doctor-schedule/enum/schedule-slot.enum';

export class PayScheduleAccountBalanceTransactionDto {
  @ApiProperty({
    description: 'Transaction Amount',
    example: 500000,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Product Type',
    example: 'Subscription',
  })
  @IsNotEmpty()
  @IsString()
  product_type: string;

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