import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: String(id) },
      select: {
        viewHistory: true,
        canCreateuser: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ permissions: user });
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
