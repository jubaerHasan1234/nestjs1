import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
@Controller('users')
export class AdminController {
  @Get('admin')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard, ThrottlerGuard)
  @Throttle({
    default: { limit: 5, ttl: 30 * 1000 },
  })
  getAdminData(@Req() req: any) {
    return { message: 'Welcome Admin', user: req.user };
  }
}
