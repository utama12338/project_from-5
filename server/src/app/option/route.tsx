import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
  try {
   
    const type = searchParams.get('type');

    let options;
    
    switch (type) {
      case 'environment':
        options = await prisma.environmentOption.findMany();
        break;
      case 'server-type':
        options = await prisma.serverTypeOption.findMany();
        break;
      case 'server-role':
        options = await prisma.serverRoleOption.findMany();
        break;
      case 'server-duty':
        options = await prisma.serverDutyOption.findMany();
        break;
      case 'production-unit':
        options = await prisma.productionUnitOption.findMany();
        break;
      case 'developer-unit':
        options = await prisma.developerUnitOption.findMany();
        break;
      case 'yes-no':
        options = await prisma.yesNoOption.findMany();
        break;
      case 'dr-dc':
        options = await prisma.drDcOption.findMany();
        break;
      case 'developer-type':
        options = await prisma.developerTypeOption.findMany();
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid option type' },
          { status: 400 }
        );
    }

    return NextResponse.json(options);
  } catch (error) {
    console.error(`Error fetching ${searchParams.get('type')} options:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch options' },
      { status: 500 }
    );
  }
}
