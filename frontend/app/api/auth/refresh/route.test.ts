import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    const session = await prisma.userToken.findFirst({
      where: {
        refreshToken,
        isRevoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = 
      await generateToken(session.userId);

    // Update session
    await prisma.userToken.update({
      where: { id: session.id },
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        lastUsedAt: new Date(),
      },
    });

    return NextResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }, {
      headers: {
        'Set-Cookie': `auth-token=${newAccessToken}; Path=/; HttpOnly; Secure; SameSite=Strict`
      }
    });
  } catch (error) {
    console.error('refresh endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
