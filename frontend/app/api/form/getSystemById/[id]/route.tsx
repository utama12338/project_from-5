import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

// GET /api/forms/[id]
export async function GET(
    _req: NextRequest ,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        

        

        const system = await prisma.systemInfo.findUnique({
            where: {
                id: id
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
    } ;
}