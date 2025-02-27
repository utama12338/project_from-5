import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import * as jose from 'jose';

const prisma = new PrismaClient();
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY;

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

    // Verify tokens using jose
    try {
      if (!JWT_PUBLIC_KEY) {
        throw new Error("JWT_PUBLIC_KEY is not defined in environment variables");
      }
      
      // Import the public key
      const publicKey = await jose.importSPKI(JWT_PUBLIC_KEY, 'ES512');
      
      if (accessToken) {
        // Verify access token
        const { payload } = await jose.jwtVerify(accessToken, publicKey);
        const userId = payload.userId as string;
        
        // Invalidate the token in database
        await prisma.userToken.updateMany({
          where: {
            userId: userId,
            refreshToken: accessToken,
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
