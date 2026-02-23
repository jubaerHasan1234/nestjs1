import { ApiProperty } from '@nestjs/swagger'; // Swagger ইমপোর্ট
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class RegisterDto {
  @ApiProperty({
    example: 'Jubaer Hossain',
    description: 'ইউজারের পূর্ণ নাম',
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'jubaer@example.com',
    description: 'ইউজারের বৈধ ইমেইল এড্রেস',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'পাসওয়ার্ড (ন্যূনতম ৬ ক্যারেক্টার)',
    minLength: 6,
  })
  @MinLength(6)
  password!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    description: 'ইউজার রোল (USER অথবা ADMIN)',
    required: false,
    default: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
