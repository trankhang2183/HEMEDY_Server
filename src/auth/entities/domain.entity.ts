import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { DomainEnum } from '../enum/domain.enum';

class MonthlyData {
  @ApiProperty({
    description: 'Type of content (e.g., music, podcast)',
    example: 'music',
  })
  @Prop()
  type: DomainEnum;

  @ApiProperty({
    description: 'Quantity for the given type',
    example: 0,
  })
  @Prop({ default: 0 })
  quantity: number;
}

export type DomainDocument = mongoose.HydratedDocument<DomainModel>;

@Schema({
  timestamps: true,
})
export class DomainModel {
  @ApiProperty({
    description: 'Data for November',
    type: [MonthlyData],
  })
  @Prop({ type: [{ type: MonthlyData }] })
  Sep: MonthlyData[];

  @ApiProperty({
    description: 'Data for December',
    type: [MonthlyData],
  })
  @Prop({ type: [{ type: MonthlyData }] })
  Oct: MonthlyData[];

  @ApiProperty({
    description: 'Data for November',
    type: [MonthlyData],
  })
  @Prop({ type: [{ type: MonthlyData }] })
  Nov: MonthlyData[];

  @ApiProperty({
    description: 'Data for December',
    type: [MonthlyData],
  })
  @Prop({ type: [{ type: MonthlyData }] })
  Dec: MonthlyData[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const DomainSchema = SchemaFactory.createForClass(DomainModel);
