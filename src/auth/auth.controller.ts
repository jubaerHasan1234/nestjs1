import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto'; // নতুন ইমপোর্ট
import { RegisterDto } from './dto/register.dto';
// Swagger ইমপোর্টস
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication') // Swagger UI তে আলাদা সেকশন তৈরি করবে
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'নতুন ইউজার রেজিস্ট্রেশন' })
  @ApiResponse({ status: 201, description: 'ইউজার সফলভাবে তৈরি হয়েছে।' })
  @ApiResponse({ status: 400, description: 'ইমেইল অলরেডি আছে বা ভুল ইনপুট।' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'ইউজার লগইন (Access & Refresh Token জেনারেট)' })
  @ApiResponse({
    status: 200,
    description: 'লগইন সফল এবং টোকেন রিটার্ন করা হয়েছে।',
  })
  @ApiResponse({ status: 401, description: 'ইনভ্যালিড ইমেইল বা পাসওয়ার্ড।' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'রিফ্রেশ টোকেন দিয়ে নতুন এক্সেস টোকেন নেওয়া' })
  @ApiResponse({ status: 200, description: 'নতুন এক্সেস টোকেন জেনারেট হয়েছে।' })
  @ApiResponse({
    status: 401,
    description: 'ইনভ্যালিড বা এক্সপায়ার্ড রিফ্রেশ টোকেন।',
  })
  refresh(@Body() dto: RefreshTokenDto) {
    // body টাইপ পরিবর্তন করা হলো
    return this.authService.refreshToken(dto.userId, dto.refreshToken);
  }
}
