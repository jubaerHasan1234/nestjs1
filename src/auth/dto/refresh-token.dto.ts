import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 1, description: 'ইউজার আইডি' })
  userId!: number;

  @ApiProperty({
    example: 'your-refresh-token-here',
    description: 'রিফ্রেশ টোকেন',
  })
  refreshToken!: string;
}
