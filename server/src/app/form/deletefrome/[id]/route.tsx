import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { systemSchema } from '@/lib/validate_api/creatform';

const prisma = new PrismaClient();


// DELETE /api/forms/[id]
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      await prisma.systemInfo.delete({
        where: {
          id: parseInt(params.id)
        }
      });
  
      return NextResponse.json({ message: 'System deleted successfully' });
    } catch (error) {
      console.error('Error deleting system:', error);
      return NextResponse.json(
        { error: 'Failed to delete system' },
        { status: 500 }
      );
    }
  }