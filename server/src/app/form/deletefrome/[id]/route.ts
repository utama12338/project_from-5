'use server'
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE /api/forms/[id]
export async function DELETE( req: NextRequest, { params }: { params: Promise<{ id: string }> } ) {
  try {
    const { id } = await params;
    const deletedSystem = await prisma.systemInfo.delete({
      where: {
        id: parseInt(id, 10),
      },
    });

    return NextResponse.json({ message: 'System deleted successfully', deletedSystem });
  } catch (error) {
    console.error('Error deleting system:', error);
    return NextResponse.json(
      { error: 'Failed to delete system' },
      { status: 500 }
    );
  }
}
