import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { convertToSeconds } from '../lib/convertToSeconds';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  // ----------------------------
  // Global token expiry variables
  // ----------------------------
  private readonly ACCESS_TOKEN_EXPIRES: number;
  private readonly REFRESH_TOKEN_EXPIRES: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    // ✅ Env থেকে value নাও, undefined হলে default fallback
    this.ACCESS_TOKEN_EXPIRES = process.env.JWT_ACCESS_EXPIRES
      ? convertToSeconds(process.env.JWT_ACCESS_EXPIRES)
      : 900; // 15 min default

    this.REFRESH_TOKEN_EXPIRES = process.env.JWT_REFRESH_EXPIRES
      ? convertToSeconds(process.env.JWT_REFRESH_EXPIRES)
      : 1800; // 30 min default
  }

  // ----------------------------
  // Register user
  // ----------------------------
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('Email already exists');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: dto.role || 'USER', // role optional
      },
    });

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  // ----------------------------
  // Login user
  // ----------------------------
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET!,
      expiresIn: this.ACCESS_TOKEN_EXPIRES, // ✅ use class property
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET!,
      expiresIn: this.REFRESH_TOKEN_EXPIRES, // ✅ use class property
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refreshTokenHash },
    });

    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
    };
  }

  // ----------------------------
  // Refresh access token
  // ----------------------------
  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Access denied');

    // ✅ Step 1: Check if refresh token hash matches
    const isValidHash = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValidHash) throw new UnauthorizedException('Invalid refresh token');

    // ✅ Step 2: Verify JWT expiry
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET!,
      });
    } catch (err) {
      // token expired or invalid
      throw new UnauthorizedException('Refresh token expired or invalid');
    }

    // ✅ Step 3: Generate new access token
    const newAccessToken = await this.jwtService.signAsync<JwtPayload>(
      {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET!,
        expiresIn: this.ACCESS_TOKEN_EXPIRES, // class property
      },
    );

    return { accessToken: newAccessToken };
  }
  // ----------------------------
  // Logout user
  // ----------------------------
  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { message: 'Logout successful' };
  }
}
