import { ApiProperty } from '@nestjs/swagger'; // Swagger ইমপোর্ট
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'ইউজারের নিবন্ধিত ইমেইল এড্রেস',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'ইউজারের পাসওয়ার্ড',
  })
  @IsNotEmpty()
  password!: string;
}
