import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsPhoneNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { RoleEnum } from 'src/role/enum/role.enum';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'User Name of User',
    example: 'example',
    required: false,
  })
  @IsString()
  @IsOptional()
  fullname: string;

  @ApiProperty({
    description: 'Avatar URL of User',
    example: 'https://www.example.com/avatar.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  avatar_url: string;

  @ApiProperty({
    description: 'Date of Birth of User',
    example: '2001-02-22',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dob: Date;

  @ApiProperty({
    description: 'Gender of User',
    example: 'Male',
    required: false,
  })
  @IsString()
  @IsOptional()
  gender: string;

  @ApiProperty({
    description: 'Address of User',
    example: 'Ho Chi Minh',
    required: false,
  })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({
    description: 'Address Detail of User',
    example: 'Số 123, khu phố 4',
    required: false,
  })
  @IsString()
  @IsOptional()
  address_detail: string;

  @ApiProperty({
    description: 'Phone Number of User',
    example: '0838462852',
    required: false,
  })
  @IsPhoneNumber('VN')
  @IsOptional()
  phone_number: string;

  @ApiProperty({
    description: 'Specialized Field',
    example: 'Friendly',
    required: false,
  })
  @IsString()
  @IsOptional()
  specialized_field: string;

  @ApiProperty({
    description: 'Specialty',
    example: 'Friendly',
    required: false,
  })
  @IsString()
  @IsOptional()
  specialty: string;

  @ApiProperty({
    description: 'Treatment Method',
    example: 'Friendly',
    required: false,
  })
  @IsString()
  @IsOptional()
  treatment_method: string;

  @ApiProperty({
    description: 'Experience',
    example: '5 years of experience',
    required: false,
  })
  @IsString()
  @IsOptional()
  experience: string;

  @ApiProperty({
    description: 'Certificate',
    example: 'Certified Professional',
    required: false,
  })
  @IsString()
  @IsOptional()
  certificate: string;

  @ApiProperty({
    description: 'Career',
    example: 'Doctor',
    required: false,
  })
  @IsString()
  @IsOptional()
  career: string;

  @ApiProperty({
    description: 'Other Information',
    example: 'Additional details',
    required: false,
  })
  @IsString()
  @IsOptional()
  otherInformation: string;

  @ApiProperty({
    description: 'Role Name of User',
    example: 'Admin',
  })
  @IsEnum(RoleEnum)
  @IsOptional()
  role_name: string;
}
