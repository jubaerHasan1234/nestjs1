import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id!: number; // এখানে ! যোগ করা হয়েছে

  @ApiProperty({ example: 'Jubaer Hossain' })
  name!: string; // এখানে ! যোগ করা হয়েছে

  @ApiProperty({ example: 'jubaer@example.com' })
  email!: string; // এখানে ! যোগ করা হয়েছে
}
