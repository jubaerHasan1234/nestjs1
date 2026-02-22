import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'jubaerhasan154@gmail.com', pass: 'edjv ybex nhac wgkt' },
  });

  async sendMail(to: string, subject: string, text: string) {
    try {
      const info = await this.transporter.sendMail({
        from: '"NestJS App" <no-reply@yourdomain.com>',
        to,
        subject,
        text,
      });
      console.log('Message sent: %s', info.messageId);
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Nodemailer Error:', error); // এটি আপনার টার্মিনালে আসল এরর দেখাবে
      throw error; // এটি NestJS-কে এররটি পাস করবে
    }
  }
}
