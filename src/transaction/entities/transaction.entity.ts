import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { User } from 'src/user/entities/user.entity';

export type TransactionDocument = mongoose.HydratedDocument<Transaction>;

@Schema({
  timestamps: true,
})
export class Transaction {
  @ApiProperty({
    description: 'User ID',
    example: '64f8dcd5b591d0d4892be123',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user_id: User;

  @ApiProperty({
    description: 'Transaction Code',
    example: 'transaction_code',
  })
  @Prop({ required: true })
  transaction_code: string;

  @ApiProperty({
    description: 'Payment Type',
    example: 'MoMo',
  })
  @Prop({ required: true })
  payment_type: string;

  @ApiProperty({
    description: 'Transaction Amount',
    example: 500000,
  })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({
    description: 'Transaction Status',
    example: 'Waiting',
  })
  @Prop({ required: true, enum: ['Waiting', 'Success', 'Failure'] })
  status: string;

  @ApiProperty({
    description: 'Transaction Type',
    example: 'Purchase',
  })
  @Prop({ required: true })
  transaction_type: string;

  @ApiProperty({
    description: 'Product Type',
    example: 'Subscription',
  })
  @Prop({ required: false })
  product_type: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
