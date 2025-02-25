import { NextResponse } from 'next/server';
import * as jose from 'jose';
import { cookies } from 'next/headers';

const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token');
      console.log({'cookieStore':accessToken,'accessTokenddddd':cookieStore})
    if (!accessToken || !JWT_PUBLIC_KEY) {
      return NextResponse.json(
        { valid: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    try {
      // Convert PEM public key to KeyLike
      const publicKey = await jose.importSPKI(JWT_PUBLIC_KEY, 'ES512');
      
      // Verify the token
      const { payload } = await jose.jwtVerify(accessToken.value, publicKey, {
        algorithms: ['ES512']
      });

      return NextResponse.json({
        valid: true,
        decoded: payload
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