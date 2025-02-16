import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { systemSchema } from '@/lib/validate_api/creatform';
import { validate } from '@/lib/utils';
import { z } from 'zod';

const prisma = new PrismaClient();



// ดึงข้อมูลทั้งหมด
export async function GET(req: NextRequest) {
    try {
      const systems = await prisma.systemInfo.findMany({
        include: {
          environmentInfo: true,
          connectionInfo: true,
          securityInfo: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
  
      return NextResponse.json(systems);
    } catch (error) {
      console.error('Error fetching systems:', error);
      return NextResponse.json(
        { error: 'Failed to fetch systems' },
        { status: 500 }
      );
    }
  }