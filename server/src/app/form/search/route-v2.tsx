import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const systemName = searchParams.get('systemName');
    const serverName = searchParams.get('serverName');
    const environment = searchParams.get('environment');
    const ip = searchParams.get('ip');
    const developType = searchParams.get('developType');
    const businessUnit = searchParams.get('businessUnit');

    const systems = await prisma.systemInfo.findMany({
      where: {
        AND: [
          systemName ? { systemName: { equals: systemName } } : undefined,
          developType ? { developType: { equals: developType } } : undefined,
          businessUnit ? { businessUnit: { equals: businessUnit } } : undefined,
          
          (environment || serverName || ip) ? {
            environmentInfo: {
              some: {
                AND: [
                  environment ? { environment: { equals: environment } } : undefined,
                  serverName ? { serverName: { equals: serverName } } : undefined,
                  ip ? { ip: { equals: ip } } : undefined,
                ].filter(condition => condition !== undefined)
              }
            }
          } : undefined,
        ].filter(condition => condition !== undefined)
      },
      include: {
        environmentInfo: true,
        connectionInfo: true,
        securityInfo: true,
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
