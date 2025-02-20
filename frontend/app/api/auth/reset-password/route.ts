import { NextResponse } from 'next/server';
import argon2 from 'argon2';
import { PrismaAuthAdapter } from '../../adapters/prisma-auth.adapter';

const authAdapter = new PrismaAuthAdapter();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find token in database
    const userToken = await authAdapter.findUserToken(token);

    if (!userToken || userToken.isRevoked || userToken.tokenType !== 'RESET_PASSWORD') {
      return NextResponse.json(
        { message: 'Invalid or expired reset token' },
        { status: 401 }
      );
    }

    // Check if token is expired
    if (new Date() > userToken.expiresAt) {
      return NextResponse.json(
        { message: 'Reset token has expired' },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await argon2.hash(newPassword);

    // Update user's password
    await authAdapter.updateUserPassword(userToken.userId, hashedPassword);

    // Revoke the reset token
    await authAdapter.invalidateUserToken(token);

    // Revoke all existing access and refresh tokens for security
    await authAdapter.invalidateAllUserTokens(userToken.userId);

    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
