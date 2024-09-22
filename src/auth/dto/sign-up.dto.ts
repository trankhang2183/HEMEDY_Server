import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'Full name',
    example: 'Abc',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({
    description: 'Email of User',
    example: 'example@gmail.com',
    nullable: false,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password of User',
    example: 'Abc123!@#',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
