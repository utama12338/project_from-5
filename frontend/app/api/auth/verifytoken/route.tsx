import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token');

    if (!accessToken || JWT_PUBLIC_KEY === undefined) {
      return NextResponse.json(
        { valid: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    try {
      // Verify the token
      const decoded = jwt.verify(accessToken.value, JWT_PUBLIC_KEY, {
        algorithms: ['ES512']
      });

      // Check if token is about to expire (less than 1 minute remaining)
      const exp = (decoded as any).exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeRemaining = exp - now;

      if (timeRemaining < 60000) { // Less than 1 minute remaining
        return NextResponse.json({
          valid: false,
          message: 'Token is about to expire'
        }, { status: 401 });
      }

      return NextResponse.json({
        valid: true,
        decoded
      }, { status: 200 });

    } catch (verifyError) {
      return NextResponse.json({
        valid: false,
        message: 'Invalid token'
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { valid: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}