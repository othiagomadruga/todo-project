import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError('Token JWT não fornecido', 401));
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return next(new AppError('Erro no Token', 401));
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return next(new AppError('Token mal formatado', 401));
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new AppError('Token inválido', 401));
    }

    req.user = decoded as { id: string };
    return next();
  });
};
