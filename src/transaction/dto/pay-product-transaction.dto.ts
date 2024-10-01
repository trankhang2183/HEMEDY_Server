import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class PayProductTransactionDto {
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
}
