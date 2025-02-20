import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { SystemSearchParams } from '@/types/inputform';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const systemName = searchParams.get('systemName');
    const serverName = searchParams.get('serverName');
    const environment = searchParams.get('environment');
    const ip = searchParams.get('ip');
    const developType = searchParams.get('developType');
    const businessUnit = searchParams.get('businessUnit');

    const whereClause: SystemSearchParams = {};

    if (systemName) {
      whereClause.systemName = { equals: systemName };
    }
    if (developType) {
      whereClause.developType = { equals: developType };
    }
    if (businessUnit) {
      whereClause.businessUnit = { equals: businessUnit };
    }
    if (environment || serverName || ip) {
      whereClause.environmentInfo = {
        some: {
          ...(environment && { environment: { equals: environment } }),
          ...(serverName && { serverName: { equals: serverName } }),
          ...(ip && { ip: { equals: ip } })
        }
      };
    }

    const systems = await prisma.systemInfo.findMany({
      where: whereClause , // Type assertion needed due to Prisma's type complexity
      include: {
        environmentInfo: true,
        connectionInfo: true,
        securityInfo: true,
        user: {
          select: {
            id: true,
            username: true,
          }
        }
      }
    });

    return NextResponse.json(systems);
  } catch (error) {
    console.error('Error searching systems:', error);
    return NextResponse.json(
      { error: 'Failed to search systems' },
      { status: 500 }
    );
  }
}