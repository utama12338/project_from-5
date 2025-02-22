import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

// Initialize Prisma Client
const prisma = new PrismaClient();
const JWT_SECRETs = process.env.JWT_SECRET || 'oomsinintrnership';

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

    // สร้าง access token และ refresh token
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRETs,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_SECRETs,
      { expiresIn: '2h' }
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
        loginCount: 1
      }
    });

    // สร้าง session สำหรับผู้ใช้
    await prisma.userSession.create({
      data: {
        userId: user.id,
        userAgent: request.headers.get('user-agent') || undefined,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    });

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

    // ส่งเฉพาะข้อมูล user กลับไป (ไม่ส่ง tokens)
    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Login successful'
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    // ปิดการเชื่อมต่อ Prisma
    await prisma.$disconnect();
  }
}