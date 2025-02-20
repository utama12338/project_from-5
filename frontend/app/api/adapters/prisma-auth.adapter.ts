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

  async invalidateUserToken(token: string): Promise<void> {
    await this.prisma.userToken.updateMany({
      where: { token },
      data: { isRevoked: true }
    });
  }

  async findUserToken(token: string) {
    return await this.prisma.userToken.findUnique({
      where: {
        token: token
      }
    });
  }

  async updateUserPassword(userId: string, hashedPassword: string) {
    return await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        password: hashedPassword
      }
    });
  }

  async invalidateAllUserTokens(userId: string) {
    return await this.prisma.userToken.updateMany({
      where: {
        userId: userId,
        isRevoked: false
      },
      data: {
        isRevoked: true,
        updatedAt: new Date()
      }
    });
  }

  async findUserById(userId: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    });
  }

  async updateTokenLastUsed(token: string) {
    return await this.prisma.userToken.update({
      where: {
        token: token
      },
      data: {
        lastUsedAt: new Date()
      }
    });
  }
}
