import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

// Initialize Prisma Client
const prisma = new PrismaClient();
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY ;
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
console.log(JWT_PRIVATE_KEY)
console.log(JWT_PUBLIC_KEY)
export async function POST(request: Request) {
  try {
    // ตรวจสอบว่ามี request body หรือไม่
    if (!request.body) {
      return NextResponse.json(
        { message: 'Request body is empty' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { username, password, csrfToken } = body;

    // Verify CSRF token
    const cookieStorecsrf = await cookies();
    const storedToken = cookieStorecsrf.get('csrf-token');
    
    if (!storedToken || storedToken.value !== csrfToken) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }



    // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบหรือไม่
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // ค้นหาผู้ใช้จาก username
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // ตรวจสอบรหัสผ่านด้วย bcrypt
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // เพิ่มจำนวน loginCount ในตาราง User
    await prisma.user.update({
      where: { id: user.id },
      data: { loginCount: { increment: 1 } }
    });

    // สร้าง access token และ refresh token
    const accessToken = jwt.sign(
      { userId: user.id},
      JWT_PRIVATE_KEY,
      { 
        algorithm: 'ES512',
        expiresIn: '15m' 
      }
    );

    // ยืนยันkey
    // jwt.verify(token, PUBLIC_KEY, { algorithms: ['ES256'] });

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_PRIVATE_KEY,
      { 
        algorithm: 'ES512',
        expiresIn: '2h' 
      }
    );

    // บันทึก token ลงในฐานข้อมูล
    await prisma.userToken.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken,
        tokenType: 'ACCESS',
        deviceInfo: request.headers.get('user-agent') || undefined,
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        lastUsedAt: new Date(),
        
      }
    });
    
    
    
    // Invalidate the CSRF token after use
    cookieStorecsrf.delete('csrf-token');
    
    // เก็บ tokens ใน HTTP-only cookies
    const cookieStore = await cookies();
    
    // ตั้งค่า access token cookie
    cookieStore.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes in seconds
      path: '/'
    });

    // ตั้งค่า refresh token cookie
    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60 * 60, // 2 hours in seconds
      path: '/'
    });

    // ลบข้อมูลรหัสผ่านออกก่อนส่งกลับ
    const { password: _, ...userWithoutPassword } = user;

    // Log successful login
    // await LogService.logActivity({
    //   userId: user.id,
    //   action: 'LOGIN',
    //   module: 'AUTH',
    //   description: 'User logged in successfully',
    //   userAgent: request.headers.get('user-agent') || undefined,
    //   ipAddress: request.headers.get('x-forwarded-for') || undefined
    // });


    // ส่งเฉพาะข้อมูล user กลับไป (ไม่ส่ง tokens)
    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Login successful'
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);

    // await LogService.logError({
    //   errorType: 'AUTH_ERROR',
    //   message: error.message,
    //   stackTrace: error.stack,
    //   path: '/api/auth/login',
    //   userAgent: request.headers.get('user-agent') || undefined,
    //   ipAddress: request.headers.get('x-forwarded-for') || undefined
    // });

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    // ปิดการเชื่อมต่อ Prisma
    await prisma.$disconnect();
  }
}