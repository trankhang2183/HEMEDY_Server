import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class PayProductStripeTransactionDto {
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
    description: 'Product Name',
    example: 'Subscription',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Product Image Url',
    example: 'Image URL',
  })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({
    description: 'Product Description',
    example: 'Subscription',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
