import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { systemSchema } from '@/lib/validate_api/creatform';

const prisma = new PrismaClient();

// PUT /api/forms/[id]
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const updateData = await req.json();
      const validationResult = systemSchema.safeParse(updateData);
      const { id } = await params;
      if (!validationResult.success) {
        return NextResponse.json(
          {
            errors: validationResult.error.errors.map(error => ({
              field: error.path.join('.'),
              message: error.message
            }))
          },
          { status: 400 }
        );
      }
  
      const now = new Date();
      const updatedSystem = await prisma.systemInfo.update({
        where: {
          id: parseInt(id)
        },
        data: {
          systemName: updateData.systemName,
          developType: updateData.developType,
          contractNo: updateData.contractNo,
          vendorContactNo: updateData.vendorContactNo,
          businessUnit: updateData.businessUnit,
          developUnit: updateData.developUnit,
          computerbackup: updateData.computerbackup,
          updatedAt: now,
          environmentInfo: {
            deleteMany: {},
            create: updateData.environmentInfo.map((env: any) => ({
              ...env,
              id: undefined,
              systemInfoId: undefined,
              updatedAt: now
            }))
          },
          connectionInfo: {
            deleteMany: {},
            create: updateData.connectionInfo.map((conn: any) => ({
              ...conn,
              id: undefined,
              systemInfoId: undefined,
              updatedAt: now
            }))
          },
          securityInfo: {
            deleteMany: {},
            create: updateData.securityInfo.map((sec: any) => ({
              ...sec,
              id: undefined,
              systemInfoId: undefined,
              updatedAt: now
            }))
          }
        },
        include: {
          environmentInfo: true,
          connectionInfo: true,
          securityInfo: true
        }
      });
  
      return NextResponse.json(updatedSystem);
    } catch (error) {
      console.error('Error updating system:', error);
      return NextResponse.json(
        { error: 'Failed to update system' },
        { status: 500 }
      );
    }
  }