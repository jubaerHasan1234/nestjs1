import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', true); // behind proxy IP ঠিক detect হবে

  app.useGlobalFilters(new AllExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
