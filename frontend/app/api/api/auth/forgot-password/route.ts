import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../../../utils/auth';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findFirst({
      where: { username: email }
    });

    if (!user) {
      // Return 200 even if user not found for security
      return NextResponse.json(
        { message: 'If an account exists, a password reset link will be sent' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Removed unused accessToken variable
    await generateToken(user.id);

    // Store reset token
    await prisma.userToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        tokenType: 'RESET_PASSWORD',
        expiresAt: new Date(Date.now() + 3600000), // 1 hour
        deviceInfo: request.headers.get('user-agent') || undefined,
        ipAddress: request.headers.get('x-forwarded-for') || undefined
      }
    });

    // In a real application, send email with reset link
    const resetLink = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-password?token=${resetToken}`;
    console.log('Reset link:', resetLink);

    return NextResponse.json(
      { 
        message: 'If an account exists, a password reset link will be sent',
        // Only include token in development
        ...(process.env.NODE_ENV === 'development' && { 
          debug: { resetToken, resetLink } 
        })
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
