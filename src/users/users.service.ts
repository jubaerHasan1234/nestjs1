import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // ----------------------------
  // Create user with password hashing
  // ----------------------------
  async createUser(data: { name?: string; email: string; password: string }) {
    // Check if email already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) throw new BadRequestException('Email already exists');

    // Hash the password
    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash, // ✅ required field
      },
    });
  }

  // ----------------------------
  // Get all users
  // ----------------------------
  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  // ----------------------------
  // Get user by ID
  // ----------------------------
  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // ----------------------------
  // Update user (name/email only)
  // ----------------------------
  async updateUser(id: number, data: { name?: string; email?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // ----------------------------
  // Delete user
  // ----------------------------
  async deleteUser(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
