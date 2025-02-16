import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const systemName = searchParams.get('systemName');

    if (!systemName) {
      return NextResponse.json(
        { error: 'System name is required' },
        { status: 400 }
      );
    }

    const existingSystem = await prisma.systemInfo.findFirst({
      where: {
        systemName: systemName
      }
    });

    return NextResponse.json(existingSystem);
  } catch (error) {
    console.error('Error checking system:', error);
    return NextResponse.json(
      { error: 'Failed to check system' },
      { status: 500 }
    );
  }
}
