import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service'; // Prisma ইমপোর্ট করুন

// Swagger ইমপোর্ট যোগ করা হলো
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users') // Swagger-এ ইউজার সেকশন তৈরি করবে
@ApiBearerAuth() // JWT টোকেন ইনপুট দেওয়ার অপশন যোগ করবে
@Controller('users')
export class UsersController {
  constructor(
    private readonly prisma: PrismaService, // সরাসরি Prisma ইনজেক্ট করা হলো
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Redis ক্যাশ ইনজেক্ট করা হলো
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'গেট ইউজার প্রোফাইল' }) // Swagger বর্ণনা
  @ApiResponse({ status: 200, description: 'সফলভাবে প্রোফাইল পাওয়া গেছে।' })
  @ApiResponse({ status: 401, description: 'অথরাইজেশন এরর।' })
  profile(@Req() req: any) {
    return {
      message: 'Protected route accessed',
      user: req.user,
    };
  }

  // --------------------------------------------------
  // Get All Users (Direct DB Query with Manual Caching)
  // --------------------------------------------------
  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'সব ইউজারের লিস্ট দেখা (Redis Caching সহ)' }) // Swagger বর্ণনা
  @ApiResponse({ status: 200, description: 'ইউজার লিস্ট সফলভাবে পাওয়া গেছে।' })
  async getAllUsers() {
    const cacheKey = 'all_users_list';

    // ১. ক্যাশ থেকে ডাটা নেওয়া
    const cachedUsers = await this.cacheManager.get(cacheKey);

    if (cachedUsers) {
      console.log('Serving from Redis Cache...');
      return cachedUsers; // সরাসরি ডাটা রিটার্ন করুন
    }

    // ২. ক্যাশে না থাকলে DB কুয়েরি
    console.log('Serving from Database (Prisma)...');
    const users = await this.prisma.user.findMany({
      select: { id: true, name: true, email: true },
    });

    // ৩. ক্যাশে সেভ করা (ম্যাজিক এখানে!)
    // নোট: যদি cache-manager v5 ব্যবহার করেন, তবে TTL মিলিসেকেন্ডে দিন।
    // ৬০,০০০ ms = ১ মিনিট।
    await this.cacheManager.set(cacheKey, users, 60000);

    return users;
  }
}
