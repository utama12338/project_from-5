import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { systemSchema } from '@/lib/validate_api/creatform';

const prisma = new PrismaClient();

// GET /api/forms/[id]
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const system = await prisma.systemInfo.findUnique({
        where: {
          id: parseInt(params.id)
        },
        include: {
          environmentInfo: true,
          connectionInfo: true,
          securityInfo: true
        }
      });
  
      if (!system) {
        return NextResponse.json(
          { error: 'System not found' },
          { status: 404 }
        );
      }
  
      return NextResponse.json(system);
    } catch (error) {
      console.error('Error fetching system:', error);
      return NextResponse.json(
        { error: 'Failed to fetch system' },
        { status: 500 }
      );
    }
  }