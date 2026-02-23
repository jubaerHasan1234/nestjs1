import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

// Swagger ইমপোর্টগুলো যোগ করা হলো
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Admin') // Swagger ড্যাশবোর্ডে Admin সেকশন তৈরি করবে
@ApiBearerAuth() // JWT লক আইকন যোগ করবে
@Controller('users')
export class AdminController {
  @Get('admin')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard, ThrottlerGuard)
  @Throttle({
    default: { limit: 5, ttl: 30 * 1000 },
  })
  // Swagger ডকুমেন্টেশন ডেকোরেটরসমূহ
  @ApiOperation({
    summary: 'অ্যাডমিন ড্যাশবোর্ড ডাটা',
    description:
      'শুধুমাত্র ADMIN রোল থাকা ইউজাররা এটি অ্যাক্সেস করতে পারবে। রেট লিমিট: ৩০ সেকেন্ডে ৫ বার।',
  })
  @ApiResponse({
    status: 200,
    description: 'সফলভাবে অ্যাডমিন ডাটা পাওয়া গেছে।',
  })
  @ApiResponse({
    status: 401,
    description: 'আন-অথরাইজড: টোকেন নেই অথবা টোকেনটি ইনভ্যালিড।',
  })
  @ApiResponse({
    status: 403,
    description: 'অ্যাক্সেস ডিনাইড (ইউজার অ্যাডমিন নয়)।',
  })
  @ApiResponse({
    status: 429,
    description: 'টু মেনি রিকোয়েস্ট (রেট লিমিট এক্সিডেড)।',
  })
  getAdminData(@Req() req: any) {
    return { message: 'Welcome Admin', user: req.user };
  }
}
