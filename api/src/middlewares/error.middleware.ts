import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ZodError } from 'zod';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Erro de validação de dados',
      issues: err.issues,
    });
  }

  console.error('Erro Interno do Servidor:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Erro Interno do Servidor',
  });
};
