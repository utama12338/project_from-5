import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'oomsinintrnership';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!accessToken && !refreshToken) {
      return NextResponse.json(
        { message: 'No tokens found' },
        { status: 400 ,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
          // 'X-Frame-Options': 'DENY',
          // 'X-XSS-Protection': '1; mode=block',
          // 'Cache-Control': 'no-store, max-age=0',
          // 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
        }
      }
      );
    }

    // Verify and decode access token
    try {
      if (accessToken) {
        const decoded = jwt.verify(accessToken, JWT_SECRET) as { userId: string };
        
        // Invalidate the token in database
        await prisma.userToken.updateMany({
          where: {
            userId: decoded.userId,
            token: accessToken,
            isRevoked: false
          },
          data: {
            isRevoked: true,
            updatedAt: new Date()
          }
        });
      }

      if (refreshToken) {
        // Also invalidate refresh token if it exists
        await prisma.userToken.updateMany({
          where: {
            refreshToken: refreshToken,
            isRevoked: false
          },
          data: {
            isRevoked: true,
            updatedAt: new Date()
          }
        });
      }
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      // Continue with cookie clearing even if token verification fails
    }

    // Clear cookies
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
          // 'X-Frame-Options': 'DENY',
          // 'X-XSS-Protection': '1; mode=block',
          // 'Cache-Control': 'no-store, max-age=0',
          // 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
        }
      }
    );

    // Clear cookies with matching names from login
    response.cookies.set('access_token', '', { 
      maxAge: -1,
      path: '/',
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    response.cookies.set('refresh_token', '', {
      maxAge: -1,
      path: '/',
      // secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
