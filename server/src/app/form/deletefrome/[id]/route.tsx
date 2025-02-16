import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number(params.id); // ใช้ Number() แทน parseInt()

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid ID format' },
                { status: 400 }
            );
        }

        await prisma.systemInfo.delete({
            where: { id }
        });

        return NextResponse.json(
            { message: 'System deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting system:', error);
        return NextResponse.json(
            { error: 'Failed to delete system' },
            { status: 500 }
        );
    }
}
