import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'oomsinintrnership';

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}
