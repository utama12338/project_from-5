import { PrismaClient, User, UserToken } from '@prisma/client';
import { IAuthAdapter } from './auth.adapter';

export class PrismaAuthAdapter implements IAuthAdapter {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async createUserToken(data: {
    userId: string;
    token: string;
    refreshToken: string;
    deviceInfo?: string;
    ipAddress?: string;
    expiresAt: Date;
  }): Promise<UserToken> {
    return this.prisma.userToken.create({
      data: {
        ...data,
        tokenType: 'ACCESS',
      },
    });
  }
}
