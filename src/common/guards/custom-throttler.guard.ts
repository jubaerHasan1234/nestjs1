import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: any): Promise<string> {
    // x-forwarded-for (proxy), IPv4, IPv6 সব handle
    let ip =
      req.headers['x-forwarded-for']?.split(',')[0] || // proxy
      req.connection?.remoteAddress || // fallback IPv4
      req.socket?.remoteAddress || // fallback
      req.ip || // normal req.ip
      'global';

    // IPv6 localhost '::1' কে normalize করে IPv4 হিসেবে নাও
    if (ip === '::1') ip = '127.0.0.1';

    return ip;
  }
}
