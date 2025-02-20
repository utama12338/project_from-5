import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { verifyToken } from '../../utils/auth';

// Generate CSRF token
function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Verify CSRF token
async function verifyCSRFToken(token: string): Promise<boolean> {
  const cookieStore = await cookies();
  const storedToken = cookieStore.get('csrf-token');
  return storedToken?.value === token;
}

// GET handler to generate and set CSRF token
export async function GET() {
  const token = generateCSRFToken();
  
  // Set cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 // 1 hour
  };

  // Create response with CSRF token
  const response = NextResponse.json(
    { csrfToken: token },
    { status: 200 }
  );

  // Set CSRF token cookie
  response.cookies.set('csrf-token', token, cookieOptions);

  return response;
}

// POST handler to verify CSRF token
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { csrfToken } = body;

    if (!csrfToken) {
      return NextResponse.json(
        { error: 'CSRF token is required' },
        { status: 400 }
      );
    }

    const isValid = await verifyCSRFToken(csrfToken);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }

    // Verify user authentication if needed
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        await verifyToken(token);
      } catch (error) {
        console.error('Authentication error:', error);
        return NextResponse.json(
          { error: 'Invalid authentication token' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { valid: true },
      { status: 200 }
    );

  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
