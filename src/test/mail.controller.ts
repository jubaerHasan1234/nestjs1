import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
// Swagger ইমপোর্টসমূহ
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendMailDto } from './dto/send-mail.dto';

@ApiTags('Mail') // Swagger UI তে Mail সেকশন তৈরি করবে
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  @ApiOperation({ summary: 'ইমেইল পাঠানোর এপিআই' })
  @ApiBody({ type: SendMailDto }) // Swagger কে ইনপুট ফরম্যাট বলে দেওয়া
  @ApiResponse({ status: 201, description: 'ইমেইল সফলভাবে পাঠানো হয়েছে।' })
  @ApiResponse({
    status: 500,
    description: 'সার্ভার এরর বা মেইল কনফিগারেশন সমস্যা।',
  })
  async sendEmail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('text') text: string,
  ) {
    console.log(to, subject, text);
    return await this.mailService.sendMail(to, subject, text);
  }
}
