import { User, UserToken } from '@prisma/client';

export interface IAuthAdapter {
  findUserByUsername(username: string): Promise<User | null>;
  createUserToken(data: {
    userId: string;
    token: string;
    refreshToken: string;
    deviceInfo?: string;
    ipAddress?: string;
    expiresAt: Date;
  }): Promise<UserToken>;
}
