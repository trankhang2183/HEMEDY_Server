import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Product Type Of Course',
    example: 'Example Course',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  product_type: string;
}
