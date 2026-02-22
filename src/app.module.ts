import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';

// import { CustomThrottlerGuard } from './common/guards/custom-throttler.guard';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { PrismaService } from './prisma/prisma.service';
import { MailController } from './test/mail.controller';
import { MailService } from './test/mail.service';
import { UploadController } from './test/upload.controller';
import { AdminController } from './users/admin.controller';
import { UsersController } from './users/users.controller';
@Module({
  imports: [
    AuthModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 30 * 1000,
          limit: 5,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: [
    UsersController,
    AdminController,
    UploadController,
    MailController,
  ],
  providers: [
    PrismaService,
    MailService,
    // {
    //   provide: APP_GUARD,
    //   useClass: CustomThrottlerGuard,
    // },
  ],
})
export class AppModule {}
