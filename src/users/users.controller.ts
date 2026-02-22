import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service'; // Prisma ইমপোর্ট করুন

@Controller('users')
export class UsersController {
  constructor(
    private readonly prisma: PrismaService, // সরাসরি Prisma ইনজেক্ট করা হলো
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Redis ক্যাশ ইনজেক্ট করা হলো
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
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
  async getAllUsers() {
    const cacheKey = 'all_users_list';

    // ১. ক্যাশ থেকে ডাটা নেওয়া
    const cachedUsers = await this.cacheManager.get(cacheKey);

    if (cachedUsers) {
      console.log('Serving from Redis Cache...');
      return cachedUsers; // সরাসরি ডাটা রিটার্ন করুন
    }

    // ২. ক্যাশে না থাকলে DB কুয়েরি
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
