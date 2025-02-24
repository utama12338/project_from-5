import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params; // ใช้ await กับ params

  try {
    const user = await prisma.user.findUnique({
      where: { id: String(id) },
      select: {
        viewHistory: true,
        canCreateuser: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ permissions: user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}