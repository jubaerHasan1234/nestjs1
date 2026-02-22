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
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;

  @IsOptional() // ✅ optional
  @IsEnum(UserRole) // ✅ only USER or ADMIN allowed
  role?: UserRole;
}
