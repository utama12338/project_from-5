import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { systemSchema } from '@/lib/validate_api/creatform';
import { validate } from '@/lib/utils';
import { z } from 'zod';
import { createUUID } from '@/lib/uuid/create_uuid';

const prisma = new PrismaClient();


// สร้างระบบใหม่
export async function POST(req: NextRequest) {
  try {
    const systemInput = await req.json();
    
    const validation = validate(systemSchema, systemInput);
    if (!validation.success) {
      return NextResponse.json(
        {
          errors: validation.error.errors.map((error: z.ZodIssue) => ({
            field: error.path.join('.'),
            message: error.message
          }))
        },
        { status: 400 }
      );
    }

    
    const uuid = createUUID();
    const id = `${validation.data.systemName}-${validation.data.developUnit}-${validation.data.environmentInfo[0].ip}-${uuid}`;

    const system = await prisma.systemInfo.create({
      data: {
        id, // Use the generated ID
        systemName: validation.data.systemName,
        developType: validation.data.developType,
        contractNo: validation.data.contractNo,
        vendorContactNo: validation.data.vendorContactNo,
        businessUnit: validation.data.businessUnit,
        developUnit: validation.data.developUnit,
        computerbackup: validation.data.computerbackup,
        environmentInfo: {
          create: validation.data.environmentInfo,
        },
        connectionInfo: {
          create: validation.data.connectionInfo,
        },
        securityInfo: {
          create: validation.data.securityInfo,
        },
      },
      include: {
        environmentInfo: true,
        connectionInfo: true,
        securityInfo: true,
      }
    });

    return NextResponse.json(system, { status: 201 });
  } catch (error) {
    console.error('Error creating system:', error);
    return NextResponse.json(
      { error: 'Failed to create system' },
      { status: 500 }
    );
  }
}