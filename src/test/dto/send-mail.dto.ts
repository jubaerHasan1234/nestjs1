import { ApiProperty } from '@nestjs/swagger';

export class SendMailDto {
  @ApiProperty({
    example: 'recipient@example.com',
    description: 'যাকে ইমেইল পাঠাবেন',
  })
  to!: string;

  @ApiProperty({ example: 'Hello from NestJS', description: 'ইমেইল এর বিষয়' })
  subject!: string;

  @ApiProperty({
    example: 'This is a test email message.',
    description: 'ইমেইল এর বডি টেক্সট',
  })
  text!: string;
}
