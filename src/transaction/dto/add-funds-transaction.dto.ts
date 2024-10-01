import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddFundTransactionDto {
  @ApiProperty({
    description: 'Transaction Amount',
    example: 500000,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
