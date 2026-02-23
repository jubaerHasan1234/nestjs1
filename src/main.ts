import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', true); // behind proxy IP ঠিক detect হবে

  // ১. Swagger কনফিগারেশন তৈরি
  const config = new DocumentBuilder()
    .setTitle('My Project API') // ডকুমেন্টেশনের নাম
    .setDescription('The API description for my NestJS project') // বর্ণনা
    .setVersion('1.0') // ভার্সন
    .addBearerAuth() // যদি JWT ব্যবহার করেন
    .build();
  // ২. ডকুমেন্টেশন অবজেক্ট তৈরি
  const document = SwaggerModule.createDocument(app, config);

  // ৩. ডকুমেন্টেশন দেখার পাথ সেট করা (যেমন: /api-docs)
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalFilters(new AllExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
