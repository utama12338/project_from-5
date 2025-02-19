import { NextResponse } from 'next/server';
import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received body:', body);
    const { username, email, password } = body;
    console.log('Sending data:', body);
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        viewHistory: false,
        canCreateuser: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        role: 'USER',
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}